import {useContext, useEffect, useState} from "react";
import {AppContext, ServicesContextType} from "../index";
import MDropdownComponent from "../components/m-dropdown.component";

function ListProductsModule () {
    const [products, setProducts] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const {dummyService}  = useContext(AppContext) || {} as ServicesContextType;

    useEffect(() => {
        fetchProducts();
    }, []);

    async function fetchProducts() {
        const products = await dummyService.getProducts();
        setProducts(products?.products || [])
    }

    return (

        <div className="grid grid-cols-4">
            <div>
                Label
            </div>
            <div className="col-span-3">
                <MDropdownComponent data={products} titleProperty={"title"} />
            </div>
        </div>
    )
}

export default ListProductsModule;