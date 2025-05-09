/**
 * Converts a single line of CSS between px and rem units.
 */
const convertCssLine = (line, config) => {
  const pxRegex = /(\d*\.?\d+)px/g;
  const remRegex = /(\d*\.?\d+)rem/g;

  const pxToRem = (match, value) => {
    const convertedValue = (parseFloat(value) / config.baseRemSize).toFixed(
      config.precision
    );
    return `${parseFloat(convertedValue)}rem`;
  };

  const remToPx = (match, value) => {
    const convertedValue = (parseFloat(value) * config.baseRemSize).toFixed(
      config.precision
    );
    return `${parseFloat(convertedValue)}px`;
  };

  // If it's a property in the exclusion list, do not convert
  for (const property of config.excludeProperties) {
    const propertyRegex = new RegExp(`${property}\\s*:\\s*[^;]+;`, "i");
    if (propertyRegex.test(line)) {
      return line;
    }
  }

  if (config.direction === "px-to-rem") {
    line = line.replace(pxRegex, pxToRem);
  } else if (config.direction === "rem-to-px") {
    line = line.replace(remRegex, remToPx);
  }

  return line;
};

/**
 * Converts CSS between px and rem units (line by line processing).
 */
const convertCssUnits = (css, config) => {
  const lines = css.split("\n");
  const convertedLines = [];

  for (const line of lines) {
    const trimLine = line.trim();

    if (trimLine.startsWith("@media")) {
      convertedLines.push(line); // Keep the @media line
      continue;
    }

    convertedLines.push(convertCssLine(line, config));
  }

  return convertedLines.join("\n");
};
