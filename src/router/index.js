import Vue from "vue";
import VueRouter from "vue-router";
import Register from "../views/admin/register";
import Login from "../views/admin/login";
import Index from "../views/admin/index";
import Nav_Index from "../views/admin/nav/index.vue";
import Nav_Add from "../views/admin/nav/add.vue";
import Category_Index from "../views/admin/category/index.vue";
import Category_Add from "../views/admin/category/add.vue";
import Product_Index from "../views/admin/product/index.vue";
import Product_Add from "../views/admin/product/add.vue";
import Product_Edit from "../views/admin/product/edit.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "login",
    component: Login
  },
  {
    path: "/register",
    name: "register",
    component: Register
  },
  {
    path: "/admin/index",
    name: "index",
    component: Index
  },
  {
    path: "/admin/nav/index",
    name: "nav_index",
    component: Nav_Index
  },
  {
    path: "/admin/nav/add",
    name: "nav_add",
    component: Nav_Add
  },
  {
    path: "/admin/category/index",
    name: "Category_index",
    component: Category_Index
  },
  {
    path: "/admin/category/add",
    name: "category_add",
    component: Category_Add
  },
  {
    path: "/admin/product/index",
    name: "Product_index",
    component: Product_Index
  },
  {
    path: "/admin/product/add",
    name: "Product_add",
    component: Product_Add
  },
  {
    path: "/admin/product/edit",
    name: "Product_edit",
    component: Product_Edit
  }
];

const router = new VueRouter({
  routes
});

export default router;
