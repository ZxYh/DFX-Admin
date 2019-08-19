<template>
  <div class="m-login">
    <div class="content">
      <h1>大飞象资源回收
        <br>后台管理系统
      </h1>

      <div class="login-form">
        <el-input type="email" placeholder="请输入邮箱" icon="user" v-model.trim="username"></el-input>

        <div class="el-input">
          <input
            v-model.trim="password"
            @keyup.enter="login"
            type="password"
            placeholder="请输入密码"
            autocomplete="off"
            class="el-input__inner"
          >
        </div>
        <el-button type="primary" @click="login">登录</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import api from "@/api/login";
export default {
  data() {
    return {
      username: "",
      password: ""
    };
  },
  created() {
    // if (localStorage.isLogin === "true") {
    //   this.$router.replace("/");
    // }
  },
  methods: {
    async login() {
      if (!this.username) {
        this.$notify.error("请输入邮箱");
      } else if (!this.password) {
        this.$notify.error("请输入密码");
      } else {
        const { code, data, err } = await api.login({
          email: this.username,
          pwd: this.password
        });
        if (code === 200) {
          localStorage.isLogin = true;
          localStorage.username = this.username;
          this.$store.commit("SET_PERMISSIONS", {
            permissions: data
          })
          this.$store.commit('SET_LOGIN', {
            ifLogin: true
          })
          this.$notify.success({ title: "提示", message: "登录成功" });
          this.$router.push({
            name: "welcome"
          });
        } else {
          this.$message.error(err);
        }
      }
    }
  }
};
</script>

<style lang="less">
.m-login {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  top: 0;
  // background: url("../assets/login-bg.png") no-repeat center;
  background: -webkit-linear-gradient(left, #28b0ca, #668955);
  // background-size: cover;
  display: flex;
  justify-content: center;
  align-items: center;

  .content {
    width: 350px;
    margin-top: -250px;
    text-align: center;
    color: white;

    h1 {
      font-weight: normal;
      margin-bottom: 20px;
    }

    .el-alert {
      margin-bottom: 28px;
    }

    .login-form {
      padding: 40px 30px;
      background: rgba(255, 255, 255, 0.3);
      box-shadow: 0px 5px 4px 1px rgba(113, 116, 121, 0.37);
      border-radius: 10px;

      .el-input__icon {
        left: 0;
        right: auto;
      }
      .el-input__icon + .el-input__inner {
        padding-left: 35px;
        padding-right: 0;
      }
      .el-icon-user:after {
        width: 18px;
        height: 20px;
        // background: url("../assets/icon/user.png");
        background-size: 100% 100%;
        margin-top: 7px;
      }
      .el-icon-password:after {
        width: 15px;
        height: 20px;
        // background: url("../assets/icon/password.png");
        background-size: 100% 100%;
        margin-top: 7px;
      }

      .el-input:nth-child(1) {
        margin-bottom: 20px;
      }
      .el-button {
        width: 100%;
        margin-top: 30px;
      }
    }
  }
}
</style>
