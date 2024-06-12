export async function loadFonts() {
  const modules = import.meta.glob('~/assets/fonts/*.{ttf,otf,woff,woff2}');
  const fonts = Object.keys(modules).map(async (key) => {
    const fontName = key.split('/').pop()?.split('.')[0];
    const fontUrl = await modules[key]();
    return { value: fontName, label: fontName, url: fontUrl.default };
  });
  return Promise.all(fonts);
}