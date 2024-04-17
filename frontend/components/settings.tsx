import React from 'react';
import ReactDOM from 'react-dom';
import { Millennium } from '../millennium';

const PluginComponent: React.FC = () => {
    console.log("SETTINGS PANEL DETECTED");
  
    // Return JSX for the component
    return (
      <div>
        This is an example element
      </div>
    );
}

function RenderSettingsModal(_context: any) 
{
    console.log("SETTINGS PANEL DETECTED")

    Millennium.findElement(_context.m_popup.document, "._EebF_xe4DGRZ9a0XkyDj.Panel").then(element => {
        console.log(element)

        ReactDOM.render(<PluginComponent />, element[0]);
    })
}

export { RenderSettingsModal }