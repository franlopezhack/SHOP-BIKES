import { useState, useEffect } from "react";
import { useLocation } from "react-router";
import { getProducts } from "../../services/api";

function ProductList() {

    const [products, setProducts] = useState(undefined)
    const { search } = useLocation()

    useEffect(() => {
        console.log('apuraaaaaaaa')
        const category = new URLSearchParams(search).get("category")
        getProducts(category)
            .then((products) => {
                setProducts(products)
            })
    }, [search])

    if (!products) {
        return null
    }

    return (
        <div>
            {JSON.stringify(products)}
        </div>
    )
}

export default ProductList