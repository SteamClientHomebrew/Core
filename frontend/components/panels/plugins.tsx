import React, { useEffect, useState } from 'react';
import { Millennium } from '../../millennium';

const PluginViewModal: React.FC = () => {

  const [plugins, setPlugins] = useState([])
  const [checkedItems, setCheckedItems] = useState<any>({});

  const indent: any = {"--indent-level": 0}

  useEffect(() => {
    Millennium.callServerMethod("find_all_plugins").then((value: any) => {
      const json = JSON.parse(value)
      console.log(json)

      json.forEach((plugin: any, index: number) => {
        if (plugin.enabled) {
          setCheckedItems({
            ...checkedItems,
            [index]: true
          });
        }
      });

      setPlugins(json)
    })
  }, [])

  const handleCheckboxChange = (index: number) => {

    const updated = !checkedItems[index]

    if (plugins[index]?.data?.name == "millennium__internal") {
      return;
    }

    setCheckedItems({
      ...checkedItems,
      [index]: updated
    });

    Millennium.callServerMethod("update_plugin_status", {
      plugin_name: plugins[index]?.data?.name, 
      enabled: updated
    })
  };

  return (
    <>
      <div className="DialogHeader">Plugins</div>
      <div className="DialogBody aFxOaYcllWYkCfVYQJFs0">
        {plugins.map((value: any, _index: number) => (
          <div className="S-_LaQG5eEOM2HWZ-geJI qFXi6I-Cs0mJjTjqGXWZA _3XNvAmJ9bv_xuKx5YUkP-5 _3bMISJvxiSHPx1ol-0Aswn _3s1Rkl6cFOze_SdV2g-AFo _5UO-_VhgFhDWlkDIOZcn_ XRBFu6jAfd5kH9a3V8q_x wE4V6Ei2Sy2qWDo_XNcwn Panel" style={indent} key={_index}>
            <div className="H9WOq6bV_VhQ4QjJS_Bxg">
              <div className="_3b0U-QDD-uhFpw6xM716fw">{value?.data?.common_name}</div>
              <div className="_2ZQ9wHACVFqZcufK_WRGPM">
                <div className="_3N47t_-VlHS8JAEptE5rlR">
                  <div className={`_24G4gV0rYtRbebXM44GkKk ${checkedItems[_index] ? '_3ld7THBuSMiFtcB_Wo165i' : ''} Focusable`} onClick={() => handleCheckboxChange(_index)} tabIndex={0}>
                    <div className="_2JtC3JSLKaOtdpAVEACsG1"></div>
                    <div className="_3__ODLQXuoDAX41pQbgHf9"></div>
                  </div>
                </div>
              </div>
            </div>
            <div className="_2OJfkxlD3X9p8Ygu1vR7Lr">{value?.data?.description ?? "No description yet."}</div>
          </div>
        ))} 
      </div>
    </>
  )
}

export { PluginViewModal }