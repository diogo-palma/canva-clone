// vite.config.mts
import path from "path";
import { defineConfig } from "file:///H:/projetos/canva-clone/node_modules/vite/dist/node/index.js";
import vue from "file:///H:/projetos/canva-clone/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import Icons from "file:///H:/projetos/canva-clone/node_modules/unplugin-icons/dist/vite.js";
import IconsResolve from "file:///H:/projetos/canva-clone/node_modules/unplugin-icons/dist/resolver.js";
import Components from "file:///H:/projetos/canva-clone/node_modules/unplugin-vue-components/dist/vite.js";
import { ElementPlusResolver } from "file:///H:/projetos/canva-clone/node_modules/unplugin-vue-components/dist/resolvers.js";
import Unocss from "file:///H:/projetos/canva-clone/node_modules/unocss/dist/vite.mjs";
import {
  presetAttributify,
  presetIcons,
  presetUno,
  transformerDirectives,
  transformerVariantGroup
} from "file:///H:/projetos/canva-clone/node_modules/unocss/dist/index.mjs";
var __vite_injected_original_dirname = "H:\\projetos\\canva-clone";
var pathSrc = path.resolve(__vite_injected_original_dirname, "src");
var vite_config_default = defineConfig({
  resolve: {
    alias: {
      "~/": `${pathSrc}/`
    }
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@use "~/styles/element/index.scss" as *;`
      }
    }
  },
  plugins: [
    vue(),
    Components({
      // allow auto load markdown components under `./src/components/`
      extensions: ["vue", "md"],
      // allow auto import and register components used in markdown
      include: [/\.vue$/, /\.vue\?vue/, /\.md$/],
      resolvers: [
        ElementPlusResolver({
          importStyle: "sass"
        }),
        IconsResolve()
      ],
      dts: "src/components.d.ts"
    }),
    // https://github.com/antfu/unocss
    // see unocss.config.ts for config
    Unocss({
      presets: [
        presetUno(),
        presetAttributify(),
        presetIcons({
          scale: 1.2,
          warn: true
        })
      ],
      transformers: [
        transformerDirectives(),
        transformerVariantGroup()
      ]
    }),
    Icons({
      compiler: "vue3",
      autoInstall: true
    })
  ]
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcubXRzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiSDpcXFxccHJvamV0b3NcXFxcY2FudmEtY2xvbmVcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkg6XFxcXHByb2pldG9zXFxcXGNhbnZhLWNsb25lXFxcXHZpdGUuY29uZmlnLm10c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vSDovcHJvamV0b3MvY2FudmEtY2xvbmUvdml0ZS5jb25maWcubXRzXCI7aW1wb3J0IHBhdGggZnJvbSAncGF0aCdcbmltcG9ydCB7IGRlZmluZUNvbmZpZyB9IGZyb20gJ3ZpdGUnXG5pbXBvcnQgdnVlIGZyb20gJ0B2aXRlanMvcGx1Z2luLXZ1ZSdcblxuaW1wb3J0IEljb25zIGZyb20gJ3VucGx1Z2luLWljb25zL3ZpdGUnXG5pbXBvcnQgSWNvbnNSZXNvbHZlIGZyb20gJ3VucGx1Z2luLWljb25zL3Jlc29sdmVyJ1xuXG5pbXBvcnQgQ29tcG9uZW50cyBmcm9tICd1bnBsdWdpbi12dWUtY29tcG9uZW50cy92aXRlJ1xuaW1wb3J0IHsgRWxlbWVudFBsdXNSZXNvbHZlciB9IGZyb20gJ3VucGx1Z2luLXZ1ZS1jb21wb25lbnRzL3Jlc29sdmVycydcblxuaW1wb3J0IFVub2NzcyBmcm9tICd1bm9jc3Mvdml0ZSdcbmltcG9ydCB7XG4gIHByZXNldEF0dHJpYnV0aWZ5LFxuICBwcmVzZXRJY29ucyxcbiAgcHJlc2V0VW5vLFxuICB0cmFuc2Zvcm1lckRpcmVjdGl2ZXMsXG4gIHRyYW5zZm9ybWVyVmFyaWFudEdyb3VwLFxufSBmcm9tICd1bm9jc3MnXG5cbmNvbnN0IHBhdGhTcmMgPSBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCAnc3JjJylcblxuLy8gaHR0cHM6Ly92aXRlanMuZGV2L2NvbmZpZy9cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XG4gIHJlc29sdmU6IHtcbiAgICBhbGlhczoge1xuICAgICAgJ34vJzogYCR7cGF0aFNyY30vYCxcbiAgICB9LFxuICB9LFxuICBjc3M6IHtcbiAgICBwcmVwcm9jZXNzb3JPcHRpb25zOiB7XG4gICAgICBzY3NzOiB7XG4gICAgICAgIGFkZGl0aW9uYWxEYXRhOiBgQHVzZSBcIn4vc3R5bGVzL2VsZW1lbnQvaW5kZXguc2Nzc1wiIGFzICo7YCxcbiAgICAgIH0sXG4gICAgfSxcbiAgfSxcbiAgcGx1Z2luczogW1xuICAgIHZ1ZSgpLFxuICAgIENvbXBvbmVudHMoe1xuICAgICAgLy8gYWxsb3cgYXV0byBsb2FkIG1hcmtkb3duIGNvbXBvbmVudHMgdW5kZXIgYC4vc3JjL2NvbXBvbmVudHMvYFxuICAgICAgZXh0ZW5zaW9uczogWyd2dWUnLCAnbWQnXSxcbiAgICAgIC8vIGFsbG93IGF1dG8gaW1wb3J0IGFuZCByZWdpc3RlciBjb21wb25lbnRzIHVzZWQgaW4gbWFya2Rvd25cbiAgICAgIGluY2x1ZGU6IFsvXFwudnVlJC8sIC9cXC52dWVcXD92dWUvLCAvXFwubWQkL10sXG4gICAgICByZXNvbHZlcnM6IFtcbiAgICAgICAgRWxlbWVudFBsdXNSZXNvbHZlcih7XG4gICAgICAgICAgaW1wb3J0U3R5bGU6ICdzYXNzJyxcbiAgICAgICAgfSksXG4gICAgICAgIEljb25zUmVzb2x2ZSgpXG4gICAgICBdLFxuICAgICAgZHRzOiAnc3JjL2NvbXBvbmVudHMuZC50cycsXG4gICAgfSksXG5cbiAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vYW50ZnUvdW5vY3NzXG4gICAgLy8gc2VlIHVub2Nzcy5jb25maWcudHMgZm9yIGNvbmZpZ1xuICAgIFVub2Nzcyh7XG4gICAgICBwcmVzZXRzOiBbXG4gICAgICAgIHByZXNldFVubygpLFxuICAgICAgICBwcmVzZXRBdHRyaWJ1dGlmeSgpLFxuICAgICAgICBwcmVzZXRJY29ucyh7XG4gICAgICAgICAgc2NhbGU6IDEuMixcbiAgICAgICAgICB3YXJuOiB0cnVlLFxuICAgICAgICB9KSxcbiAgICAgIF0sXG4gICAgICB0cmFuc2Zvcm1lcnM6IFtcbiAgICAgICAgdHJhbnNmb3JtZXJEaXJlY3RpdmVzKCksXG4gICAgICAgIHRyYW5zZm9ybWVyVmFyaWFudEdyb3VwKCksXG4gICAgICBdXG4gICAgfSksXG4gICAgSWNvbnMoe1xuICAgICAgY29tcGlsZXI6ICd2dWUzJyxcbiAgICAgIGF1dG9JbnN0YWxsOiB0cnVlLFxuICAgIH0pLFxuICBdLFxufSlcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBK1AsT0FBTyxVQUFVO0FBQ2hSLFNBQVMsb0JBQW9CO0FBQzdCLE9BQU8sU0FBUztBQUVoQixPQUFPLFdBQVc7QUFDbEIsT0FBTyxrQkFBa0I7QUFFekIsT0FBTyxnQkFBZ0I7QUFDdkIsU0FBUywyQkFBMkI7QUFFcEMsT0FBTyxZQUFZO0FBQ25CO0FBQUEsRUFDRTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxPQUNLO0FBakJQLElBQU0sbUNBQW1DO0FBbUJ6QyxJQUFNLFVBQVUsS0FBSyxRQUFRLGtDQUFXLEtBQUs7QUFHN0MsSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDMUIsU0FBUztBQUFBLElBQ1AsT0FBTztBQUFBLE1BQ0wsTUFBTSxHQUFHLE9BQU87QUFBQSxJQUNsQjtBQUFBLEVBQ0Y7QUFBQSxFQUNBLEtBQUs7QUFBQSxJQUNILHFCQUFxQjtBQUFBLE1BQ25CLE1BQU07QUFBQSxRQUNKLGdCQUFnQjtBQUFBLE1BQ2xCO0FBQUEsSUFDRjtBQUFBLEVBQ0Y7QUFBQSxFQUNBLFNBQVM7QUFBQSxJQUNQLElBQUk7QUFBQSxJQUNKLFdBQVc7QUFBQTtBQUFBLE1BRVQsWUFBWSxDQUFDLE9BQU8sSUFBSTtBQUFBO0FBQUEsTUFFeEIsU0FBUyxDQUFDLFVBQVUsY0FBYyxPQUFPO0FBQUEsTUFDekMsV0FBVztBQUFBLFFBQ1Qsb0JBQW9CO0FBQUEsVUFDbEIsYUFBYTtBQUFBLFFBQ2YsQ0FBQztBQUFBLFFBQ0QsYUFBYTtBQUFBLE1BQ2Y7QUFBQSxNQUNBLEtBQUs7QUFBQSxJQUNQLENBQUM7QUFBQTtBQUFBO0FBQUEsSUFJRCxPQUFPO0FBQUEsTUFDTCxTQUFTO0FBQUEsUUFDUCxVQUFVO0FBQUEsUUFDVixrQkFBa0I7QUFBQSxRQUNsQixZQUFZO0FBQUEsVUFDVixPQUFPO0FBQUEsVUFDUCxNQUFNO0FBQUEsUUFDUixDQUFDO0FBQUEsTUFDSDtBQUFBLE1BQ0EsY0FBYztBQUFBLFFBQ1osc0JBQXNCO0FBQUEsUUFDdEIsd0JBQXdCO0FBQUEsTUFDMUI7QUFBQSxJQUNGLENBQUM7QUFBQSxJQUNELE1BQU07QUFBQSxNQUNKLFVBQVU7QUFBQSxNQUNWLGFBQWE7QUFBQSxJQUNmLENBQUM7QUFBQSxFQUNIO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
