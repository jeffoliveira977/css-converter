$(document).ready(function () {
  $("#color-map").text(
    "## Usage Example:\n\n" +
      "--color-primary: #ff0000\n" +
      "--color-secondary: #00ff00\n" +
      "--color-tertiary: #0000ff\n" +
      "--color-quaternary: #ffff00\n"
  );

  const $tabs = $(".tab-button");
  const $tabContents = $(".tab-content");

  $tabs.on("click", function () {
    const $clickedTab = $(this);

    const purple700 = "bg-purple-700 hover:bg-purple-800";
    const gray700 = "bg-gray-700 hover:bg-gray-600";

    $tabs.each(function () {
      const $tab = $(this);
      $tab.removeClass("active " + purple700);
      $tab.addClass(gray700);
    });

    // Add the active class to the clicked tab
    $clickedTab.removeClass(gray700);
    $clickedTab.addClass("active " + purple700);

    // Hide all content areas
    $tabContents.each(function () {
      $(this).addClass("hidden").removeClass("active");
    });

    const tabId = $clickedTab.data("tab");
    const $activeContent = $("#" + tabId);
    $activeContent.removeClass("hidden").addClass("active");
  });

  /* File upload handling */
  $("#file-upload-button").on("click", function () {
    $("#file-upload").trigger("click");
  });

  $("#file-upload").on("change", function () {
    const files = this.files;
    if (files.length > 0) {
      const file = files[0];
      const reader = new FileReader();

      reader.onload = function (e) {
        $("#input-css").val(e.target.result);
      };

      reader.readAsText(file);
    }
  });

  /* URL handling */
  $("#url-button").on("click", async function () {
    const urlRegex = /^(https?:\/\/[^\s]+)$/i;
    const url = $("#css-url").val();
    if (url?.trim() !== "" && urlRegex.test(url)) {
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`Error loading URL: ${response.status}`);
        }
        const cssText = await response.text();
        $("#input-css").val(cssText);
        showMessage("CSS loaded from URL successfully!", "success");
      } catch (error) {
        showMessage("Error loading URL: " + error.message, "error");
      }
    } else {
      showMessage("Please enter a valid URL.", "warning");
    }
  });

  /* Clipboard handling */
  $("#copy-result").click(async function () {
    copyToClipboard("output-css");

    $(this).text("Copied!");

    setTimeout(() => {
      $(this).html(
        '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="button-icon" viewBox="0 0 16 16"><path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z"/><path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h3zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3z"/></svg> Copy'
      );
    }, 1500);
  });

  /* Download handling */
  $("#download-result").on("click", function () {
    const output = $("#output-css").val();
    if (!output) {
      showMessage("No content to download.", "warning");
      return;
    }

    const blob = new Blob([output], { type: "text/css" });
    const url = URL.createObjectURL(blob);

    const $a = $("<a>")
      .attr("href", url)
      .attr("download", "converted_css.css")
      .appendTo("body")
      .on("click", function () {
        this.click();

        setTimeout(() => {
          $(this).remove();
          URL.revokeObjectURL(url);
        }, 100);
      });

    $a[0].click();
  });

  /* Conversion handling */
  $("#convert-button").click(function () {
    const inputCss = $("#input-css").val();
    if (!inputCss) {
      showMessage("Please enter CSS to convert.", "warning");
      return;
    }

    if ($("#color-converter").hasClass("active")) {
      processColors(inputCss);
    } else {
      processUnits(inputCss);
    }
  });

  const processUnits = (inputCss) => {
    const direction = $("#direction").val();
    const baseRemSize = parseInt($("#baseRemSize").val());
    const precision = parseInt($("#precision").val());
    const excludeProps = $("#excludeProperties")
      .val()
      .split(",")
      .map((prop) => prop.trim())
      .filter((prop) => prop.length > 0);

    const result = convertCssUnits(inputCss, {
      direction,
      baseRemSize,
      precision,
      excludeProps,
    });

    showOutputCss(result);
  };

  const processColors = (inputCss) => {
    const mode = $("#conversion-mode").val();
    const prefix = $("#prefix").val();
    const colorMap = parseColorMap($("#color-map").val());

    try {
      const variables = getCSSVariables(inputCss);
      const outputCss = convertColors(inputCss, {
        variables,
        mode,
        prefix,
        colorMap,
      });
      showOutputCss(outputCss);
    } catch (error) {
      showMessage("Error converting: " + error.message, "error");
    }
  };

  const showOutputCss = (css) => {
    $("#output-css").val(css);
    const $result = $("#conversion-result");
    $result.removeClass("hidden");

    const $actions = $("#result-actions");
    $actions.removeClass("hidden").addClass("flex");
  };

});
