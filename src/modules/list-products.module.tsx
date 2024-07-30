import {useContext, useEffect, useState} from "react";
import {AppContext, ServicesContextType} from "../index";
import MDropdownComponent from "../components/m-dropdown.component";
import { MDropdownProps } from "../components/m-dropdown.props";


function ListProductsModule () {
    const [products, setProducts] = useState([]);
    const {dummyService}  = useContext(AppContext) || {} as ServicesContextType;
    const [config, setConfig] =  useState<MDropdownProps>({titleProperty: "title", data: products, search: true})

    const setConfigValue = (key: keyof MDropdownProps, value: any) => {
        config[key] = value;
        setConfig({...config});
    }

    async function fetchProducts() {
        const products = await dummyService.getProducts();
        setProducts(products?.products || [])
    }

    useEffect(() => {
        fetchProducts();
    }, []);

    useEffect(() => {
        config.data = products;
        setConfig({...config})
    }, [products, setProducts])


    return (
        <div className="grid grid-cols-3">
            <div className="grid bg-slate-400 grid-flow-row py-4 gap-4">
                <div className="grid grid-cols-3 items-center pr-3">
                    <div>Id</div>
                    <div className="col-span-2">
                        <input className="w-full" onChange={(e) => setConfigValue("id", e.target.value)} />
                    </div>
                </div>
                <div className="grid grid-cols-3 items-center pr-3">
                    <div>Is Multiple</div>
                    <div className="col-span-2 place-self-start">
                        <input type="checkbox" checked={config.multiple} className="w-full" onChange={(e) => setConfigValue("multiple", e.target.checked)} />
                    </div>
                </div>
                <div className="grid grid-cols-3 items-center pr-3">
                    <div>Use Search</div>
                    <div className="col-span-2 place-self-start">
                        <input type="checkbox" checked={config.search} className="w-full" onChange={(e) => setConfigValue("search", e.target.checked)} />
                    </div>
                </div>
                <div className="grid grid-cols-3 items-center pr-3">
                    <div>Z Index</div>
                    <div className="col-span-2 place-self-start">
                        <input type="number" className="w-full" onChange={(e) => setConfigValue("zIndexDropdown", e.target.value)} />
                    </div>
                </div>
            </div>
            <div className="col-span-2 grid grid-cols-3 items-start">
                <div>
                    Label
                </div>
                <div className="col-span-2">
                    <MDropdownComponent {...config}/>
                </div>
            </div>
        </div>
    )
}

export default ListProductsModule;