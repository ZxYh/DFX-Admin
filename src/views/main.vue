<template>
    <div class="g-wrapper flex">
        <div class="g-sidebar" id="g-sidebar">
            <el-menu :default-active="$route.path" class="el-menu-vertical-demo"  unique-opened router :collapse="isCollapse" background-color="#304156" text-color="#f2f2f2">
                <!-- <el-submenu :index="routes.path" v-for="(routes,index) in router" :key="index"  v-if="hasModulePermission(routes.name)">
                    <template slot="title">
                        <i :class="`${routes.meta.icon}`" style="color:#f2f2f2;"></i>
                        <span slot="title" style="margin-left: 20px">{{routes.meta.title}}</span>
                    </template>
                    <el-menu-item v-for="item in routes.children" :key="item.name" :index="item.path" >{{item.meta.title}}</el-menu-item>
                </el-submenu> -->
                <el-submenu index="person" v-if="hasModulePermission['person']">
                    <template slot="title">
                        <i class="iconfont el-icon-back-guanyanren" style="color:#f2f2f2;"></i>
                        <span slot="title" style="margin-left: 20px">员工管理</span>
                    </template>
                    <el-menu-item index="/personnel/list" >用户管理</el-menu-item>
                    <el-menu-item index="/personnel/reclaimer" >回收者管理</el-menu-item>
                    <el-menu-item index="/personnel/driver-auditing" >司机管理</el-menu-item>
                </el-submenu>
                <el-submenu index="recyclerPoint" v-if="hasModulePermission['recyclerPoint']">
                    <template slot="title">
                        <i class="iconfont el-icon-back-dizhiguanli" style="color:#f2f2f2;"></i>
                        <span slot="title" style="margin-left: 20px">回收点管理</span>
                    </template>
                    <el-menu-item index="/recyclerPoint/list" >回收点列表</el-menu-item>
                    <el-menu-item index="/recyclerPoint/statistics" >回收量统计</el-menu-item>
                </el-submenu>
                <el-submenu index="recyclerMerchant" v-if="hasModulePermission['recyclerMerchant']">
                    <template slot="title">
                        <i class="iconfont el-icon-back-shouye" style="color:#f2f2f2;"></i>
                        <span slot="title" style="margin-left: 20px">回收商管理</span>
                    </template>
                    <el-menu-item index="/recycler" >回收商列表</el-menu-item>
                </el-submenu>
                <el-submenu index="order" v-if="hasModulePermission['order']">
                    <template slot="title">
                        <i class="iconfont el-icon-back-yanchurili" style="color:#f2f2f2;"></i>
                        <span slot="title" style="margin-left: 20px">订单管理</span>
                    </template>
                    <el-menu-item index="/order/recovery" >回收订单管理</el-menu-item>
                    <el-menu-item index="/order/appointment" >回收请求管理</el-menu-item>
                    <el-menu-item index="/order/driver" >司机订单任务</el-menu-item>
                    <el-menu-item index="/order/urgent" >紧急订单管理</el-menu-item>
                    <el-menu-item index="/order/OwnRecycler" >自有回收者订单任务</el-menu-item>
                </el-submenu>
                <el-submenu index="finance" v-if="hasModulePermission['finance']">
                    <template slot="title">
                        <i class="iconfont el-icon-back-daifukuan" style="color:#f2f2f2;"></i>
                        <span slot="title" style="margin-left: 20px">财务管理</span>
                    </template>
                    <el-menu-item index="/finance/cash" >提现管理</el-menu-item>
                    <el-menu-item index="/finance/recharge" >回收商充值</el-menu-item>
                    <el-menu-item index="/finance/record" >交易记录</el-menu-item>
                </el-submenu>
                <el-submenu index="admin" v-if="hasModulePermission['admin']">
                    <template slot="title">
                        <i class="iconfont el-icon-back-wode" style="color:#f2f2f2;"></i>
                        <span slot="title" style="margin-left: 20px">管理员管理</span>
                    </template>
                    <el-menu-item index="/admin/role" >角色管理</el-menu-item>
                    <el-menu-item index="/admin/list" >管理员管理</el-menu-item>
                </el-submenu>
                <el-submenu index="platform" v-if="hasModulePermission['platform']">
                    <template slot="title">
                        <i class="iconfont el-icon-back-fenlei" style="color:#f2f2f2;"></i>
                        <span slot="title" style="margin-left: 20px">平台管理</span>
                    </template>
                    <el-menu-item index="/platform/trading-area" >商圈管理</el-menu-item>
                    <el-menu-item index="/platform/carousel" >轮播图管理</el-menu-item>
                    <el-menu-item index="/platform/classification" >废品分类管理</el-menu-item>
                    <el-menu-item index="/platform/integral" >积分配置管理</el-menu-item>
                    <el-menu-item index="/platform/business-hours" >营业时间配置管理</el-menu-item>
                    <el-menu-item index="/platform/region" >区域管理</el-menu-item>
                </el-submenu>
            </el-menu>
        </div>
        <div class="g-body" id="g-body">
            <header class="g-header flex-between">
                <div class="flex">
                    <div><i class="iconfont el-icon-back-shujuwajue" id="iconfont" @click="handleOpen"></i></div>
                    <div class="logo" @click="$router.push('/')">
                        <img class="admin-logo" src="../assets/logo.png" style="height: 30px; ">
                        大飞象平台端管理后台
                    </div>
                </div>
                <div class="user-info">
                    <el-dropdown trigger="click" @command="handleCommand">
                        <span class="el-dropdown-link">
                            <!-- <img class="user-logo" src="../../assets/logo."> -->
                            欢迎 <span class="username">管理员</span>
                        </span>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item command="reset">修改密码</el-dropdown-item>
                            <el-dropdown-item command="loginout">退出登录</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </div>
            </header>
            <!-- <transition name="fade"> -->
                <div class="g-content">
                    <router-view></router-view>
                </div>
            <!-- </transition> -->
        </div>
    </div>
</template>

<script>
import api from '@/api/login'
import Utils from '@/utils/index'

export default {
    data () {
        return {
            activePath: '',
            router: [],
            isCollapse:false,
            hasModulePermission: {},
            moduleNames: ['person', 'recyclerPoint', 'recyclerMerchant', 'order', 'finance', 'admin', 'platform']
        }
    },
    async created () {
        // this.routes()
        
        await this.getPersonalInfo()

        // console.log('this.$store.getters.permissions: ', this.$store.getters.permissions)

        this.moduleNames.forEach((moduleName) => {
            const hasPermission = this.checkModulePermission(moduleName)

            this.$set(this.hasModulePermission, moduleName, hasPermission)
        })
    },
    methods: {
        async getPersonalInfo () {
            const { code, data, err } = await api.getPersonalInfo()
            if (code === 200) {
                this.$store.commit('SET_LOGIN')
                this.$store.commit("SET_PERMISSIONS", {
                    permissions: data.permissionKeyList
                })
            } else {
                this.$message.error(err)
                if (code === 506) {
                    // this.$store.commit('CLEAR_LOGIN')
                    // this.$router.push({ name: 'login' })
                }
            }
        },
        // routes() {
        //   this.$router.options.routes.forEach((eve, index)=>{
        //     if (!eve.hidden){
        //       this.router.push(eve)
        //     }
        //   })
        // },
        checkModulePermission (moduleName) {
            return Utils.checkModulePermission(moduleName, this.$store.getters.permissions)
        },
        async handleCommand (command) {
            if (command === 'loginout') {
                const { code, data, err } = await api.adminLogout()
                if (code === 200) {
                    localStorage.removeItem('token')
                    localStorage.removeItem('isLogin')
                    localStorage.removeItem('username')
                    // this.$router.replace('/')
                    this.$router.go(0)
                } else {
                    this.$message.error(err)
                }
            } else if (command === 'reset') {
                this.$router.push('/admin/reset-pwd')
            }
        },
        handleOpen() {
            var sidebar = document.getElementById('g-sidebar')
            var Gbody = document.getElementById('g-body')
            var iconfont = document.getElementById('iconfont')

            sidebar.style.transition = '0.5s'
            Gbody.style.transition = '0.5s'
            iconfont.style.transition = '0.5s'
            if (this.isCollapse) {
                this.isCollapse = false
                sidebar.style.width = '210px'
                Gbody.style.marginLeft = '190px'
                Gbody.style.width = document.body.clientWidth - 190 + 'px'
                Gbody.style.transition = '0.5s'
                iconfont.style.transform = 'rotate(0)'
            } else {
                this.isCollapse = true
                sidebar.style.width = '84px'
                Gbody.style.marginLeft = '64px'
                Gbody.style.width = document.body.clientWidth - 64 + 'px'
                iconfont.style.transform = 'rotate(-90deg)'
            }
        }
    }
}
</script>

<style lang="less">

</style>
