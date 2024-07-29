export async function loadFonts() {
  const defaultFonts = [
    { value: 'Arial', label: 'Arial', url: null },
    { value: 'Verdana', label: 'Verdana', url: null },
    { value: 'Tahoma', label: 'Tahoma', url: null },
    { value: 'Times New Roman', label: 'Times New Roman', url: null },
    { value: 'Courier New', label: 'Courier New', url: null },
    { value: 'Georgia', label: 'Georgia', url: null },
    { value: 'Palatino', label: 'Palatino', url: null },
    { value: 'Garamond', label: 'Garamond', url: null },
    { value: 'Bookman', label: 'Bookman', url: null },
    { value: 'Comic Sans MS', label: 'Comic Sans MS', url: null },
    { value: 'Trebuchet MS', label: 'Trebuchet MS', url: null },
    { value: 'Arial Black', label: 'Arial Black', url: null },
    { value: 'Impact', label: 'Impact', url: null },
  ];

  const modules = import.meta.glob('/public/fonts/*.{ttf,otf,woff,woff2}');
  const customFonts = Object.keys(modules).map(async (key) => {
    const fontName = key.split('/').pop()?.split('.')[0];
    const fontUrl = await modules[key]();
    return { value: fontName, label: fontName, url: fontUrl.default };
  });

  const loadedCustomFonts = await Promise.all(customFonts);  
  const allFonts = [...defaultFonts, ...loadedCustomFonts];
  allFonts.sort((a, b) => a.label.localeCompare(b.label));

  return allFonts;
}
