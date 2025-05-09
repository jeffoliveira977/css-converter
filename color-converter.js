/**
 * Checks if a string is a CSS variable
 */
const isCssVariable = (str) => {
  const trimmedStr = str.trim();
  return /^var\(--[\w-]+\)$/.test(trimmedStr) || /^--[\w-]+$/.test(trimmedStr);
};

/**
 * Extracts the variable name from a var() expression
 */
const extractVariableName = (varExpr) => {
  const match = varExpr.match(/^var\((--[\w-]+)\)$/i);
  return match ? match[1] : null;
};

/**
 * Generates a variable name for a color
 */
const generateVariableName = (color, prefix, colorMap) => {
  const lowerColor = color.toLowerCase();

  if (colorMap && colorMap[lowerColor] && isCssVariable(colorMap[lowerColor])) {
    return colorMap[lowerColor];
  }

  const match = ntc.name(lowerColor);

  return `${prefix}-${match[1].replace(/\s+/g, "-").toLowerCase()}`;
};

/**
 * Gets all CSS variables from a CSS string
 */
const getCSSVariables = (css) => {
  const variables = {};
  const regex = /--([a-zA-Z0-9-]+):\s*([^;]+);/g;
  let match;

  while ((match = regex.exec(css)) !== null) {
    const name = match[1].trim();
    const value = match[2].trim();
    variables[`--${name}`] = value;
  }

  return variables;
};

/**
 * Converts a line of CSS for color handling
 */
const convertColorLine = (line, config) => {
  if (!line.includes(":")) {
    return line;
  }

  // Split the line into property and value parts
  const colonIndex = line.indexOf(":");
  const property = line.substring(0, colonIndex).trim();

  // Find where the value ends (at the semicolon)
  const semicolonIndex = line.indexOf(";", colonIndex);
  if (semicolonIndex === -1) {
    return line;
  }

  const value = line.substring(colonIndex + 1, semicolonIndex).trim();
  const afterSemicolon = line.substring(semicolonIndex + 1);

  let newValue = value;

  // Skip processing if the property is a CSS variable
  if (isCssVariable(property)) {
    return line;
  }

  switch (config.mode) {
    case "hex-to-vars":
      // Replace hex colors with variables
      newValue = value.replace(/#([0-9A-F]{3}){1,2}/gi, (match) => {
        const varName = generateVariableName(
          match,
          config.prefix,
          config.colorMap
        );

        if (!config.definedVariables[varName]) {
          config.definedVariables[varName] = match;
          config.rootBlock.push(`${varName}: ${match};`);
        }

        return `var(${varName})`;
      });
      break;

    case "vars-to-color":
      // For multi-value properties (like "border: 1px solid var(--color)")
      if (value.includes("var(")) {
        const parts = value.split(/\s+/);
        const processedParts = parts.map((part) => {
          if (isCssVariable(part)) {
            const varName = extractVariableName(part);
            const color = config.variables[varName];
            if (config.variables[varName]) {
              return isRgbaColor(color) ? rgbaToHex(color) : color;
            }
          }
          return part;
        });
        newValue = processedParts.join(" ");
      }
      // For single value var() properties
      else if (isCssVariable(value)) {
        const varName = extractVariableName(value);
        const color = config.variables[varName];
        if (config.variables[varName]) {
          newValue = isRgbaColor(color) ? rgbaToHex(color) : color;
        }
      }
      break;
  }

  // Reconstruct the line with the new value
  return `${property}: ${newValue};${afterSemicolon}`;
};

/**
 * Parses the color map from text input
 */
const parseColorMap = (input) => {
  if (!input.trim()) return {};

  const map = {};
  const lines = input.split("\n").filter(
    (line) => line.trim() && !line.trim().startsWith("##") // Ignores comments
  );

  lines.forEach((line) => {
    const [varName, color] = line.split(":").map((part) => part.trim());
    if (color && varName) {
      map[color.toLowerCase()] = varName;
    }
  });

  return map;
};

/**
 * Converts CSS colors between hex and variables
 */
const convertColors = (css, options) => {
  const lines = css.split("\n");
  const convertedLines = [];

  // Configuration for conversion
  const config = {
    mode: options.mode || "hex-to-vars",
    prefix: options.prefix || "--color",
    variables: options.variables || {},
    colorMap: options.colorMap || {},
    definedVariables: {},
    rootBlock: [],
  };

  // Process each line
  for (const line of lines) {
    const convertedLine = convertColorLine(line, config);
    convertedLines.push(convertedLine);
  }

  // Add root block if needed
  if (config.rootBlock.length > 0 && config.mode === "hex-to-vars") {
    return `:root {\n  ${config.rootBlock.join(
      "\n  "
    )}\n}\n\n${convertedLines.join("\n")}`;
  }

  return convertedLines.join("\n");
};
