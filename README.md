# CSS Converter

**Simplify and optimize your CSS workflow with the CSS Converter!** This web-based tool provides a user-friendly interface to effortlessly transform between common CSS formats and units, making your styling process more efficient and manageable.

## Key Features

* **Color Conversion:** Seamlessly convert colors between:
    * **HEX** (`#rrggbb`, `#rrggbbaa`)
    * **RGBA** (`Not implemented yet`)
    * **CSS Variables:** Generate and apply CSS variables for consistent theming.
* **Unit Conversion:** Easily convert CSS length units:
    * **Pixels (px)** to **Root EMs (rem)**
    * **Root EMs (rem)** to **Pixels (px)**
* **Customizable Conversion:**
    * Specify the **base `rem` size** for accurate unit conversions.
    * Control the **precision** (number of decimal places) for converted values.
    * **Exclude specific CSS properties** from unit conversion.
* **File and URL Input:** Load CSS directly by pasting code, uploading a `.css` file, or fetching from a remote URL.
* **Real-time Output:** See the converted CSS instantly as you adjust settings.
* **Easy Download:** Download the converted CSS as a `.css` file.
* **Clipboard Integration:** Quickly copy the converted CSS to your clipboard.
* **Intuitive User Interface:** A clean and straightforward design for ease of use.

## Technologies Used

* HTML
* CSS (Tailwind CSS for styling)
* JavaScript

## Getting Started

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/jeffoliveira977/css-converter
    ```
2.  **Navigate to the project directory:**
    ```bash
    cd CSS-Converter
    ```
3.  **Open the `index.html` file in your web browser.**

That's it! You can now start using the CSS Converter.

## Usage

1.  **Select the desired conversion type** using the tabs (Unit Converter or Color Converter).
2.  **Input your CSS** by:
    * Pasting it into the input textarea.
    * Uploading a `.css` file using the "Choose File" button.
    * Entering a CSS file URL and clicking "Fetch URL".
3.  **Adjust the conversion settings** as needed (e.g., conversion direction, base rem size, precision, color conversion mode, variable prefix).
4.  **Click the "Convert" button.**
5.  **View the converted CSS** in the output textarea.
6.  **Copy the result** to your clipboard using the "Copy" button or **download** it as a `.css` file using the "Download" button.

## License

This project is licensed under the [MIT License](LICENSE). See the `LICENSE` file for more details.

## Author

Jeff Oliveira
