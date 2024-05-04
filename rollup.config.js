import json from '@rollup/plugin-json';
import commonjs from '@rollup/plugin-commonjs';
import replace from '@rollup/plugin-replace';
import typescript from 'rollup-plugin-typescript2';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import { defineConfig } from 'rollup';
import plugin_ from "./plugin.json"
import css from "rollup-plugin-import-css";
import { terser } from 'rollup-plugin-terser';

// wrap the callServerMethod to auto input the plugin name
/**
 * @description Intended to wrap callServerMethod in a way that implicitly provides the plugin name 
 * 
 * @param {*} methodName Initial preprocessed method name
 * @param {*} kwargs Initial preprocessed kwargs object 
 * @returns <any>
 */
async function wrappedCallServerMethod(methodName, kwargs) {
	return await Millennium.callServerMethod(pluginName, methodName, kwargs);
}

/**
 * @description Append the active plugin to the global plugin 
 * list and notify that the frontend Loaded.
 */
function globalize() {
	// Assign the plugin on plugin list. 
	Object.assign(window.PLUGIN_LIST[pluginName], millennium_main)
	// Run the rolled up plugins default exported function 
	millennium_main["default"]();
	// Notify Millennium this plugin has loaded. This propegates and calls the backend method.
	MILLENNIUM_BACKEND_IPC.postMessage(1, { pluginName: pluginName })
}

/**
 * @description Simple bootstrap function that initializes PLUGIN_LIST 
 * for current plugin given that is doesnt exist. 
 */
function bootstrap() {
	/** 
	 * This function is called n times depending on n plugin count,
	 * Create the plugin list if it wasn't already created 
	 */
	!window.PLUGIN_LIST && (window.PLUGIN_LIST = {})

	// initialize a container for the plugin
	if (!window.PLUGIN_LIST[pluginName]) {
		window.PLUGIN_LIST[pluginName] = {};
	}
}

function addPluginMain() 
{
  const cat = (parts) => { return parts.join('\n'); }
  return {
    name: 'add-plugin-main',
    generateBundle(_, bundle) {
      for (const fileName in bundle) {
        if (bundle[fileName].type != 'chunk') continue 

        bundle[fileName].code = cat([
          `const pluginName = "${plugin_["name"]}";`,
          bootstrap.toString(), bootstrap.name + "()",
          wrappedCallServerMethod.toString(), bundle[fileName].code,
          globalize.toString(), globalize.name + "()"
        ])
      }
    }
  };
}

export default defineConfig({
	input: './frontend/index.tsx',
	plugins: [
		typescript({
			exclude: [ "*millennium.ts" ]
		}),
		addPluginMain(),
		nodeResolve(),
		commonjs(),
		json(),
		css(),
		replace({
			preventAssignment: true,
			// replace callServerMethod with wrapped replacement function. 
			'Millennium.callServerMethod': `wrappedCallServerMethod`,
			delimiters: ['', ''],
			'm_private_context': 'window.PLUGIN_LIST[pluginName]',
		}),
	],
	context: 'window',
	output: {
		name: "millennium_main",
		file: "dist/index.js",
		globals: {
			react: "window.SP_REACT",
			"react-dom": "window.SP_REACTDOM"
		},
		exports: 'named',
		format: 'iife',
	},
})