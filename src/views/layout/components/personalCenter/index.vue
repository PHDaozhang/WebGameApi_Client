<template>
  <div class="PersonalCenterbox">
    <el-dialog title="个人设置" :close-on-click-modal="false" :visible.sync="dialogVisible" width="30%" :open="openfun">
      <el-tabs type="border-card" @tab-click="tabChangeEvent" v-loading="TabsLoad">
        <el-tab-pane label="修改密码">
          <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
            <el-form-item label="原密码" prop="OldPassword">
              <el-input type="password" v-model="ruleForm.OldPassword" autocomplete="off" placeholder="请输入原密码"></el-input>
            </el-form-item>
            <el-form-item label="新密码" prop="NewPassword">
              <el-input v-model="ruleForm.NewPassword" :type="passwordType" placeholder="请输入新密码" name="password" auto-complete="on"/>
              <span class="show-pwd" @click="showPwd">
                <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'"/>
              </span>
            </el-form-item>
            <el-form-item label="确认密码" prop="ConfirmPassword">
              <el-input v-model="ruleForm.ConfirmPassword" :type="passwordType" placeholder="请确认新密码" name="password" auto-complete="on"/>
              <span class="show-pwd" @click="showPwd">
                <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'"/>
              </span>
            </el-form-item>
            <el-form-item>
              <el-button @click="dialogVisible = false">取消</el-button>
              <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <!-- <el-tab-pane label="手机绑定">
          <el-form :model="phoneForm" status-icon :rules="phoneRules" ref="phoneForm" label-width="100px" class="demo-ruleForm">
            <el-form-item label="手机号" prop="phoneNum">
              <el-input v-model.number="phoneForm.phoneNum" placeholder="请输入手机号"></el-input>
            </el-form-item>
            <el-form-item label="验证码" prop="code">
              <el-col :span="17">
                <div class="grid-content bg-purple">
                  <el-input v-model.number="phoneForm.code" placeholder="请输入手机验证码"></el-input>
                </div>
              </el-col>
              <el-col :span="7">
                <div class="grid-content bg-purple-light">
                  <el-button size="small" type="primary" @click="codeBtnFun" :disabled="codeBtnBol">{{codeTxt}}</el-button>
                </div>
              </el-col>
            </el-form-item>
            <el-form-item>
              <el-button @click="dialogVisible = false">取消</el-button>
              <el-button type="primary" @click="submitForm('phoneForm')">提交</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>-->
      </el-tabs>

      <!-- <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>-->
    </el-dialog>
  </div>
</template>

<script>
import { updatePassworld } from "@/api/system/admin";
export default {
  data() {
    var checkPw = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("旧密码不能为空"));
      }
      callback();
    };
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        if (this.ruleForm.ConfirmPassword !== "") {
          this.$refs.ruleForm.validateField("ConfirmPassword");
        }
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.ruleForm.NewPassword) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    var validatePhone = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("手机号不能为空"));
      }
      callback();
    };
    var validateCode = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("验证码不能为空"));
      }
      callback();
    };
    return {
      dialogVisible: false, // 模态框是否显示
      passwordType: "password", // 密码输入框type切换
      codeTxt: "获取验证码",
      codeBtnBol: false,
      ruleForm: {
        OldPassword: "",
        NewPassword: "",
        ConfirmPassword: ""
      },
      phoneForm: {
        phoneNum: "",
        code: ""
      },
      rules: {
        OldPassword: [{ validator: checkPw, trigger: "blur" }],
        NewPassword: [{ validator: validatePass, trigger: "blur" }],
        ConfirmPassword: [{ validator: validatePass2, trigger: "blur" }]
      },
      phoneRules: {
        phoneNum: [{ validator: validatePhone, trigger: "blur" }],
        code: [{ validator: validateCode, trigger: "blur" }]
      },
      TabsLoad: false
    };
  },
  created() {},
  methods: {
    // 点击提交
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.TabsLoad = true;
          updatePassworld(this.ruleForm)
            .then(response => {
              console.log(response.data);
              this.TabsLoad = false;
              this.dialogVisible = false;
              this.$message.success("修改成功,请重新登录!");
              this.logout();
            })
            .catch(err => {
              this.TabsLoad = false;
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    // 退出登录方法
    logout() {
      this.$store.dispatch("LogOut").then(() => {
        location.reload(); // In order to re-instantiate the vue-router object to avoid bugs
      });
    },
    // 重置输入框正则验证
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    // 打开模态框
    fnChangeDialog() {
      this.dialogVisible = true;
    },
    // 输入框切换密码和数字
    showPwd() {
      if (this.passwordType === "password") {
        this.passwordType = "";
      } else {
        this.passwordType = "password";
      }
    },
    //打开模态框的监听
    openfun() {
      this.fnClearIpt();
    },
    //清空输入框
    fnClearIpt() {
      this.ruleForm.OldPassword = "";
      this.ruleForm.NewPassword = "";
      this.ruleForm.ConfirmPassword = "";
      this.phoneForm.phoneNum = "";
      this.phoneForm.code = "";
      this.resetForm("ruleForm");
      this.resetForm("phoneForm");
    },
    //监听tab变化
    tabChangeEvent(event) {
      //   console.log(event);
      this.fnClearIpt();
      this.resetForm("ruleForm");
      this.resetForm("phoneForm");
    },
    // 获取验证码按钮
    codeBtnFun() {
      this.codeBtnBol = true;
      var num = 60;
      this.myIntval = setInterval(() => {
        if (num > 0) {
          num = num - 1;
          this.codeTxt = num + "S 后重新获取";
        } else {
          this.codeBtnBol = false;
          this.codeTxt = "重新获取";
          clearInterval(this.myIntval);
        }
      }, 1000);
    }
  }
};
</script>

<style>
.PersonalCenterbox .el-button--small {
  width: 100%;
  height: 36px;
  margin-left: 1px;
}
.PersonalCenterbox .el-input__suffix {
  display: none;
}
</style>
<style scoped>
</style>

