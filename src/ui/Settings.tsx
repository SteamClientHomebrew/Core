import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { PluginViewModal } from '../components/Plugins'
import { ThemeViewModal } from './Themes'
import { UpdatesViewModal } from '../components/Updates'
import { IconsModule, Millennium, pluginSelf, Classes } from '@millennium/ui';
import { locale } from '../locales';
import { pagedSettingsClasses } from '../classes';

const activeClassName: any = pagedSettingsClasses.Active

enum Renderer {
	Plugins,
	Themes,
	Updates,
	Unset
}

const RenderViewComponent = (componentType: Renderer): any => {
	Millennium.findElement(pluginSelf.settingsDoc, ".DialogContent_InnerWidth").then((element: NodeListOf<Element>) => { 

		switch (componentType) {
			case Renderer.Plugins:   
				ReactDOM.render(<PluginViewModal/>, element[0]);
				break;   	
			case Renderer.Themes:
				ReactDOM.render(<ThemeViewModal/>, element[0]);
				break;  
			case Renderer.Updates:
				ReactDOM.render(<UpdatesViewModal/>, element[0]);
				break;  
		}
	})
}

const PluginComponent: React.FC = () => {

	const [selected, setSelected] = useState<Renderer>();
	const nativeTabs = pluginSelf.settingsDoc.querySelectorAll(`.${Classes.PagedSettingsDialog_PageListItem}:not(.MillenniumTab)`)
	nativeTabs.forEach((element: HTMLElement) => element.onclick = () => setSelected(Renderer.Unset));

	const componentUpdate = (type: Renderer) => {
		RenderViewComponent(type);
		setSelected(type)
		nativeTabs.forEach((element: HTMLElement) => {
			element.classList.remove(activeClassName);
		});
	}

	useEffect(() => {
		Millennium.findElement(pluginSelf.settingsDoc, ".DialogBody").then(_ => {
			if (pluginSelf?.OpenOnUpdatesPanel ?? false) {
				componentUpdate(Renderer.Updates)

				pluginSelf.OpenOnUpdatesPanel = false
			}
		})
	}, [])

	return (
		<>
		<div className={`MillenniumTab PluginSettingsTab ${Classes.PagedSettingsDialog_PageListItem} ${selected == Renderer.Plugins ? activeClassName : ""}`} onClick={() => componentUpdate(Renderer.Plugins)}>
			<div className={Classes.PageListItem_Icon}>
				<svg version="1.1" id="Icons" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 32 32" xmlSpace="preserve">
					<g>
						<path d="M18.3,17.3L15,20.6L11.4,17l3.3-3.3c0.4-0.4,0.4-1,0-1.4s-1-0.4-1.4,0L10,15.6l-1.3-1.3c-0.4-0.4-1-0.4-1.4,0s-0.4,1,0,1.4 L7.6,16l-2.8,2.8C3.6,19.9,3,21.4,3,23c0,1.3,0.4,2.4,1.1,3.5l-2.8,2.8c-0.4,0.4-0.4,1,0,1.4C1.5,30.9,1.7,31,2,31s0.5-0.1,0.7-0.3 l2.8-2.8C6.5,28.6,7.7,29,9,29c1.6,0,3.1-0.6,4.2-1.7l2.8-2.8l0.3,0.3c0.2,0.2,0.5,0.3,0.7,0.3s0.5-0.1,0.7-0.3 c0.4-0.4,0.4-1,0-1.4L16.4,22l3.3-3.3c0.4-0.4,0.4-1,0-1.4S18.7,16.9,18.3,17.3z"  fill="currentColor"></path>
						<path d="M30.7,1.3c-0.4-0.4-1-0.4-1.4,0l-2.8,2.8C25.5,3.4,24.3,3,23,3c-1.6,0-3.1,0.6-4.2,1.7l-3.5,3.5c-0.4,0.4-0.4,1,0,1.4l7,7 c0.2,0.2,0.5,0.3,0.7,0.3s0.5-0.1,0.7-0.3l3.5-3.5C28.4,12.1,29,10.6,29,9c0-1.3-0.4-2.4-1.1-3.5l2.8-2.8 C31.1,2.3,31.1,1.7,30.7,1.3z" fill="currentColor"></path>
					</g>
				</svg>
				{/* <IconsModule.PlugInPS5/> */}
			</div>
			<div className={Classes.PageListItem_Title}>{locale.settingsPanelPlugins}</div>
		</div>
		<div className={`MillenniumTab ThemesSettingsTab ${Classes.PagedSettingsDialog_PageListItem} ${selected == Renderer.Themes ? activeClassName : ""}`} onClick={() => componentUpdate(Renderer.Themes)}>
			<div className={Classes.PageListItem_Icon}>
				<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
					<g id="_21_-_30" data-name="21 - 30">
						<g id="Art">
							<path d="M45.936,18.9a23.027,23.027,0,0,0-1.082-2.1L39.748,30.67a4.783,4.783,0,0,1-.837,1.42,8.943,8.943,0,0,0,7.464-12.115C46.239,19.609,46.093,19.253,45.936,18.9Z" fill="currentColor"/>
							<path d="M16.63,6.4A23.508,23.508,0,0,0,2.683,37.268c.031.063.052.125.083.188a8.935,8.935,0,0,0,15.662,1.526A16.713,16.713,0,0,1,26.165,32.7c.1-.04.2-.07.3-.107a6.186,6.186,0,0,1,3.859-3.453,4.865,4.865,0,0,1,.451-2.184l7.9-17.107A23.554,23.554,0,0,0,16.63,6.4ZM10.5,32.5a4,4,0,1,1,4-4A4,4,0,0,1,10.5,32.5Zm5-11.5a4,4,0,1,1,4-4A4,4,0,0,1,15.5,21Zm12-3.5a4,4,0,1,1,4-4A4,4,0,0,1,27.5,17.5Z" fill="currentColor"/>
							<path d="M45.478,4.151a1.858,1.858,0,0,0-2.4.938L32.594,27.794a2.857,2.857,0,0,0,.535,3.18,4.224,4.224,0,0,0-4.865,2.491c-1.619,3.91.942,5.625-.678,9.535a10.526,10.526,0,0,0,8.5-6.3,4.219,4.219,0,0,0-1.25-4.887,2.85,2.85,0,0,0,3.037-1.837l8.64-23.471A1.859,1.859,0,0,0,45.478,4.151Z" fill="currentColor"/>
						</g>
					</g>
				</svg>
				{/* <IconsModule.CustomizeSteamDeck style={{height: "20px", width: "20px"}}/> */}
			</div>
			<div className={Classes.PageListItem_Title}>{locale.settingsPanelThemes}</div>
		</div>
		<div className={`MillenniumTab UpdatesSettingsTab ${Classes.PagedSettingsDialog_PageListItem} ${selected == Renderer.Updates ? activeClassName : ""}`} onClick={() => componentUpdate(Renderer.Updates)}>
			<div className={Classes.PageListItem_Icon}>
				<IconsModule.Update/>
			</div>
			<div className={Classes.PageListItem_Title}>{locale.settingsPanelUpdates}</div>
		</div>
		<div className={Classes.PageListSeparator}></div>
		</>
	);
}

/**
 * Hooks settings tabs components, and forces active overlayed panels to re-render
 * @todo A better, more integrated way of doing this, that doesn't involve runtime patching. 
 */
const hookSettingsComponent = () => {
	let processingItem = false;
	const elements = pluginSelf.settingsDoc.querySelectorAll(`.${Classes.PagedSettingsDialog_PageListItem}:not(.MillenniumTab)`);

	elements.forEach((element: HTMLElement, index: number) => {
		element.addEventListener('click', function(_: any) {

			if (processingItem) return

			console.log(pluginSelf.settingsDoc.querySelectorAll('.' + Classes.PageListSeparator))

			pluginSelf.settingsDoc.querySelectorAll('.' + Classes.PageListSeparator).forEach((element: HTMLElement) => element.classList.remove(Classes.Transparent))
			const click = new MouseEvent("click", { view: pluginSelf.settingsWnd, bubbles: true, cancelable: true })

			try {
				processingItem = true;
				if (index + 1 <= elements.length) elements[index + 1].dispatchEvent(click); else elements[index - 2].dispatchEvent(click);
				
				elements[index].dispatchEvent(click);
				processingItem = false;
			}
			catch (error) { console.log(error) }
		});
	})
}

function RenderSettingsModal(_context: any) 
{
	pluginSelf.settingsDoc = _context.m_popup.document
	pluginSelf.settingsWnd = _context.m_popup.window

	Millennium.findElement(_context.m_popup.document, "." + Classes.PagedSettingsDialog_PageList).then(element => {
		hookSettingsComponent()
		// Create a new div element
		var bufferDiv = document.createElement("div");
		bufferDiv.classList.add("millennium-tabs-list")

		element[0].prepend(bufferDiv);

		ReactDOM.render(<PluginComponent />, bufferDiv);
	})
}

export { RenderSettingsModal }