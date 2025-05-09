const isRgbaColor = (str) => {
  return /^rgb(?:a)?\(\s*\d+\s*,\s*\d+\s*,\s*\d+(?:\s*,\s*[\d.]+)?\s*\)$/i.test(
    str
  );
};

// Code taken from https://stackoverflow.com/questions/49974145/how-to-convert-rgba-to-hex-color-code-using-javascript
const rgbaToHex = (rgba, forceRemoveAlpha = false) => {
  return (
    "#" +
    rgba
      .replace(/^rgba?\(|\s+|\)$/g, "") // Gets rgba / rgb string values
      .split(",") // splits them at ","
      .filter((string, index) => !forceRemoveAlpha || index !== 3)
      .map((string) => parseFloat(string)) // Converts them to numbers
      .map((number, index) => (index === 3 ? Math.round(number * 255) : number)) // Converts alpha to 255 number
      .map((number) => number.toString(16)) // Converts numbers to hex
      .map((string) => (string.length === 1 ? "0" + string : string)) // Adds 0 when length of one number is 1
      .join("")
  ); // Puts the array together to a string
};

const showMessage = (message, type) => {
  const $status = $("#status");
  $status.text(message);
  $status.removeClass(
    "bg-green-800 bg-yellow-200 bg-red-800 text-slate-800 text-white py-2 px-4 rounded mt-4 text-center"
  );

  switch (type) {
    case "success":
      $status.addClass("bg-green-800 text-white");
      break;
    case "warning":
      $status.addClass("bg-yellow-200 text-slate-800");
      break;
    case "error":
      $status.addClass("bg-red-800 text-white");
      break;
  }

  setTimeout(() => {
    $status.text("");
    $status.removeClass(
      "bg-green-800 bg-yellow-200 bg-red-800 text-slate-800 text-white py-2 px-4 rounded mt-4 text-center"
    );
  }, 3000);
};

const copyToClipboard = async (elementId, showFeedback = true) => {
  const $element = $("#" + elementId);

  const text = $element.val();

  try {
    await navigator.clipboard.writeText(text);
    if (showFeedback) {
      const $feedback = $("<div>")
        .text("Copied!")
        .addClass(
          "fixed top-5 left-1/2 -translate-x-1/2 bg-green-500 text-white py-2 px-4 rounded-md z-50 opacity-0 transition-opacity duration-300"
        );

      $("body").append($feedback);

      setTimeout(() => {
        $feedback.addClass("opacity-100");
      }, 10);

      setTimeout(() => {
        $feedback.removeClass("opacity-100");
        setTimeout(() => $feedback.remove(), 300);
      }, 2000);
    }
    return true;
  } catch (err) {
    console.error("Error copying text: ", err);
    return false;
  }
};
