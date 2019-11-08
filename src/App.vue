<template>
  <div id="app">
    <a-layout id="components-layout-demo-side" style="min-height: 100vh">
      <a-layout-sider collapsible v-model="collapsed" v-show="!isLogin">
        <div class="logo" />
        <a-menu theme="dark" :defaultSelectedKeys="['1']" mode="inline">
          <a-sub-menu key="sub1">
            <span slot="title">
              <a-icon type="user" /><span>导航管理</span></span
            >
            <a-menu-item key="3">
              <router-link to="/admin/nav/index">
                导航列表
              </router-link>
            </a-menu-item>
            <a-menu-item key="4">
              <router-link to="/admin/nav/add">
                导航添加
              </router-link>
            </a-menu-item>
          </a-sub-menu>
          <a-sub-menu key="sub2">
            <span slot="title">
              <a-icon type="team" /><span>商分类管理</span></span
            >
            <a-menu-item key="6">
              <router-link to="/admin/category/index">
                分类列表
              </router-link>
            </a-menu-item>
            <a-menu-item key="8">
              <router-link to="/admin/category/add">
                添加分类
              </router-link>
            </a-menu-item>
          </a-sub-menu>
          <a-sub-menu key="sub3">
            <span slot="title">
              <a-icon type="team" /><span>商品管理</span></span
            >
            <a-menu-item key="9">
              <router-link to="/admin/product/index">
                商品列表
              </router-link>
            </a-menu-item>
            <a-menu-item key="10">
              <router-link to="/admin/product/add">
                添加商品
              </router-link>
            </a-menu-item>
          </a-sub-menu>
        </a-menu>
      </a-layout-sider>
      <a-layout>
        <!-- 主体内容 -->
        <router-view />
        <a-layout-footer style="text-align: center">
          Ant Design ©2018 Created by Ant UED
        </a-layout-footer>
      </a-layout>
    </a-layout>
  </div>
</template>
<script>
export default {
  data() {
    return {
      collapsed: false
    };
  },
  computed: {
    isLogin: function() {
      if (this.$route.path === "/" || this.$route.path === "/register") {
        return true;
      } else {
        return false;
      }
    }
  }
};
</script>
<style lang="scss">
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
#components-layout-demo-side .logo {
  height: 32px;
  background: rgba(255, 255, 255, 0.2);
  margin: 16px;
}
</style>
