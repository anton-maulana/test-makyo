import {createBrowserRouter} from "react-router-dom";
import React from "react";
import ListProductsModule from "../modules/list-products.module";

export const AppRouter = createBrowserRouter([
    {
        path: "/",
        element: <ListProductsModule />
    },
]);
