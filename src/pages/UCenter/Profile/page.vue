<template>
  <card>
    <i-form label-position="top" style="margin:20px">
        <formItem label="个人信息"></formItem>
        <formItem label="昵称" >
            <i-input style="width:700px;" type="text" size="large"/>
        </formItem>
        <formItem label="简介">
            <i-input style="width:700px;" type="textarea" size="large" rows="5"/>
        </formItem>
        <formItem label="地址">
            <i-input style="width:700px;" type="text" size="large"/>
        </formItem>
        <formItem label="职业">
            <i-input style="width:700px;" type="text" size="large"/>
        </formItem>
        <formItem label="头像">
          <i-row>
            <i-col span="2">
             <avatar-uploader :width="80" :height="80" :showText="false"/>
            </i-col>
            <i-col span="15">
              <i-button icon="md-download" >上传头像</i-button>
              <br/>
              可以拖动图片到左边头像区域完成上传
            </i-col>
          </i-row>
           <i-button type="success" style="margin-top:10px">确认更新</i-button>
        </formItem>
      </i-form>
    </card>
  </template>
<script></script>
<style lang="less">
</style>
