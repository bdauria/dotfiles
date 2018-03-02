module.exports = editorConfigToPrettier;

function editorConfigToPrettier(editorConfig) {
  if (!editorConfig || Object.keys(editorConfig).length === 0) {
    return null;
  }

  const result = {};

  if (editorConfig.indent_style) {
    result.useTabs = editorConfig.indent_style === "tab";
  }

  if (editorConfig.indent_size === "tab") {
    result.useTabs = true;
  }

  if (result.useTabs && editorConfig.tab_width) {
    result.tabWidth = editorConfig.tab_width;
  } else if (
    editorConfig.indent_style === "space" &&
    editorConfig.indent_size &&
    editorConfig.indent_size !== "tab"
  ) {
    result.tabWidth = editorConfig.indent_size;
  } else if (editorConfig.tab_width !== undefined) {
    result.tabWidth = editorConfig.tab_width;
  }

  if (editorConfig.max_line_length && editorConfig.max_line_length !== "off") {
    result.printWidth = editorConfig.max_line_length;
  }

  if (editorConfig.quote_type === "single") {
    result.singleQuote = true;
  } else if (editorConfig.quote_type === "double") {
    result.singleQuote = false;
  }

  return result;
}
