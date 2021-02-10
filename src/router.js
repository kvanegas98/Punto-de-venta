import Vue from "vue";
import Router from "vue-router";
import Home from "./views/Home.vue";
import Categoria from "./components/Categoria.vue";
import Articulo from "./components/Articulo.vue";
import Rol from "./components/Rol.vue";
import Usuario from "./components/Usuario.vue";
import Cliente from "./components/Cliente.vue";
import Proveedor from "./components/Proveedor.vue";
import Login from "./components/Login.vue";
import Ingreso from "./components/Ingreso.vue";
import Venta from "./components/Venta.vue";
import CategoriaGastos from "./components/CategoriaGastos.vue";
import Gasto from "./components/Gasto.vue";
import ConsultaVenta from "./components/ConsultaVenta.vue";
import ConsultaVentaContado from "./components/ConsultaVentaContado.vue";
import ConsultaVentaCredito from "./components/ConsultaVentaCredito.vue";
import ConsultaIngreso from "./components/ConsultaIngreso.vue";
import ConsultaInventario from "./components/ConsultaInventario.vue";
import ConsultaGasto from "./components/ConsultaGasto.vue";
import EstadisticaVenta from "./components/EstadisticaVenta.vue";
//import HelloWordl from "./components/HelloWordl.vue";
import store from "./store";

Vue.use(Router);

var router = new Router({
    mode: "history",
    base: process.env.BASE_URL,
    routes: [{
            path: "/",
            name: "home",
            component: Home,
            meta: {
                administrador: true,
                almacenero: true,
                vendedor: true,
            },
        },
        {
            path: "/categorias",
            name: "categorias",
            component: Categoria,
            meta: {
                administrador: true,
                almacenero: true,
            },
        },
        {
            path: "/articulos",
            name: "articulos",
            component: Articulo,
            meta: {
                administrador: true,
                almacenero: true,
            },
        },
        {
            path: "/ingresos",
            name: "ingresos",
            component: Ingreso,
            meta: {
                administrador: true,
                almacenero: true,
            },
        },
        {
            path: "/roles",
            name: "roles",
            component: Rol,
            meta: {
                administrador: true,
            },
        },
        {
            path: "/usuarios",
            name: "usuarios",
            component: Usuario,
            meta: {
                administrador: true,
            },
        },
        {
            path: "/clientes",
            name: "clientes",
            component: Cliente,
            meta: {
                administrador: true,
                vendedor: true,
            },
        },
        {
            path: "/ventas",
            name: "ventas",
            component: Venta,
            meta: {
                administrador: true,
                vendedor: true,
            },
        },
        {
            path: "/consultaventas",
            name: "consultaventas",
            component: ConsultaVenta,
            meta: {
                administrador: true,
            },
        },

        {
            path: "/consultaventasContado",
            name: "consultaventasContado",
            component: ConsultaVentaContado,
            meta: {
                administrador: true,
            },
        },
        {
            path: "/consultaventasCredito",
            name: "consultaventasCredito",
            component: ConsultaVentaCredito,
            meta: {
                administrador: true,
            },
        },
        {
            path: "/consultaingresos",
            name: "consultaingresos",
            component: ConsultaIngreso,
            meta: {
                administrador: true,
            },
        },
        {
            path: "/consultagastos",
            name: "consultagastos",
            component: ConsultaGasto,
            meta: {
                administrador: true,
            },
        },
        {
            path: "/consultainventario",
            name: "consultainventario",
            component: ConsultaInventario,
            meta: {
                administrador: true,
            },
        },
        {
            path: "/categoriagastos",
            name: "categoriagastos",
            component: CategoriaGastos,
            meta: {
                administrador: true,
            },
        },
        {
            path: "/gastos",
            name: "gastos",
            component: Gasto,
            meta: {
                administrador: true,
            },
        },
        {
            path: "/estadisticaventa",
            name: "estadisticaventa",
            component: EstadisticaVenta,
            meta: {
                administrador: true,
            },
        },

        {
            path: "/proveedores",
            name: "proveedores",
            component: Proveedor,
            meta: {
                administrador: true,
                almacenero: true,
            },
        },
        /* {
             path: "*",
             name: "*",
             component: About,
             meta: {
                 libre: true,
             },
         },*/
        {
            path: "/login",
            name: "login",
            component: Login,
            meta: {
                libre: true,
            },
        },
    ],
});

router.beforeEach((to, from, next) => {
    if (to.matched.some((record) => record.meta.libre)) {
        next();
    } else if (
        store.state.usuario &&
        store.state.usuario.rol == "Administrador"
    ) {
        if (to.matched.some((record) => record.meta.administrador)) {
            next();
        }
    } else if (store.state.usuario && store.state.usuario.rol == "Almacenero") {
        if (to.matched.some((record) => record.meta.almacenero)) {
            next();
        }
    } else if (store.state.usuario && store.state.usuario.rol == "Vendedor") {
        if (to.matched.some((record) => record.meta.vendedor)) {
            next();
        }
    } else {
        next({
            name: "login",
        });
    }
});

export default router;