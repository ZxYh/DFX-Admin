<template>
  <div>
  <div class="box">
    <div class="title">数据统计</div>
    <div class="date_title">日期</div>
    <div class="flex_content">
      <div class="flex">
        <div class="box_content right_border">
          <span>今日回收订单数量</span>
          <h2>67789单</h2>
        </div>
        <div class="box_content">
          <span>今日回收请求数量</span>
          <h2>666单</h2>
        </div>
      </div>
       <div class="flex">
        <div class="box_content right_border">
           <span>今日订单交易总额</span>
          <h2>6665825元</h2>
        </div>
        <div class="box_content">
           <span>司机总量</span>
          <h2> 67位</h2>
        </div>
      </div>
    </div>
  </div>
  <div class="box">
    <div class="title">快捷方式</div>
    <div class="flex">
      <router-link tag="div" to="/personnel/reclaimer" class="box_item">回收者管理</router-link>
      <router-link tag="div" to="/personnel/driver-auditing" class="box_item">司机管理</router-link>
    </div>
  </div>
  </div>
</template>

<script>
export default {
  name: 'welcome'
}
</script>

<style scope>
  .box{
    width: 100%;
    border: solid 1px #E1E1E1;
    margin: 20px 0;
  }
  .title{
    padding: 10px 20px;
    background: #F0F0F0;
    border-bottom: 1px solid #E1E1E1;
  }
  .date_title{
    padding: 10px 25px;
    border-bottom: 1px solid #E1E1E1;
  }
  .flex_content{
    display: flex;
    justify-content: space-between;
  }
  .flex{
    display: flex
  }
  .box_content{
    line-height: 40px;
    margin: 20px 0;
    padding: 0 40px;
    text-align: center;
  }
  .right_border{
    border-right: 1px solid #E1E1E1;
  }
  .box_item{
    background: #304255;
    color: #fff;
    width: 80px;
    height: 80px;
    line-height: 80px;
    text-align: center;
    border-radius: 50%;
    font-weight: bold;
    box-shadow: 3px 3px 10px #2D3B4D;
    cursor: pointer;
    margin: 20px;
  }
  .box_item:hover{
    box-shadow: none;
    transition: 1s;
  }
</style>
