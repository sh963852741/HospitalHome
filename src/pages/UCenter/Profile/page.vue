<template>
  <card>
    <i-form label-position="top" style="margin:20px">
        <formItem label="个人信息"></formItem>
        <formItem label="姓名" >
            <i-input style="width:700px;" type="text" size="large"/>
        </formItem>
        <formItem label="学/工号" >
            <i-input style="width:700px;" disabled type="text" size="large"/>
        </formItem>
        <formItem label="手机">
            <i-input style="width:700px;" type="text" size="large"/>
        </formItem>
        <formItem label="邮箱">
            <i-input style="width:700px;" type="text" size="large"/>
        </formItem>
        <formItem label="头像">
          <i-row>
            <i-col span="3">
             <avatar-uploader :width="128" :height="128" usage="imgAvatar" single relate-table="Users" />
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
