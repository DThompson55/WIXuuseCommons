"use strict"
const styleMappings = [
  { key: "bold", type: "BOLD", value: () => ({ fontWeightValue }) },
  { key: "color", type: "COLOR", value: (style) => ({ colorData: { foreground: colorToHex(style.color) } }) },
  {
    key: "textDecoration",
    value: (style) => {
      const mapping = {
        underline: "UNDERLINE",
        "line-through": "STRIKETHROUGH",
        overline: "OVERLINE"
      };

      return style.textDecoration
        .split(" ")
        .map(decoration => mapping[decoration])
        .filter(Boolean) // Removes undefined values if there's an unexpected value
        .map(type => ({ type }));
    }
  },
  // Add more styles here as needed...
];

styleMappings.forEach(({ key, type, value }) => {
  if (style[key]) {
    const result = value(style);
    if (Array.isArray(result)) {
      r.push(...result); // Handles multiple decorations
    } else {
      r.push({ type, ...result });
    }
  }
});