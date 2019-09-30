
<script type="text/javascript">
  import store from '@/store'
  const inputMaxLenght = 200;
  const rateList = [
        {
          label:"1:10",
          value:10
        },
        {
          label:"1:9",
          value:9
        },
        {
          label:"1:8",
          value:8
        },
        {
          label:"1:7",
          value:7
        },
        {
          label:"1:6",
          value:6
        },
        {
          label:"1:5",
          value:5
        }];
  const bankList = [
    {
      label:"中国银行",
      value:"1"
    },
    {
      label:"中国工商银行",
      value:"2"
    },
    {
      label:"中国农业银行",
      value:"3"
    },
    {
      label:"中国建设银行",
      value:"4"
    },
    {
      label:"中国交通银行",
      value:"5"
    }
  ]
        
  function checkPermission(mode) {
    if (mode) {
      const roles = store.getters && store.getters.roles;
      for (var i in roles){
        if (roles[i]["Permission"].indexOf(mode) > -1) {
          return true;
        }
      }
      return false
    } else {
      return true
    }
  }

  function getBeforeDateStr(days){
    days = days || 0;
    var myDate = new Date();
    var beforeDate = new Date(myDate - days * 24 * 3600 * 1000);
    var preDate = beforeDate.getFullYear() + "-" + appendZero(beforeDate.getMonth() + 1) + "-" + appendZero(beforeDate.getDate());
    return preDate;
  }

  function getBeforeDateTimestamp(days){
    days = days || 0;
    var myDate = new Date().getTime();
    var beforeDate = myDate - days * 24 * 3600 * 1000;
    return beforeDate;
  }


  function appendZero(obj) {
    if (obj < 10) {
        return "0" + obj;
    } else {
        return obj;
    }
  }

  export default {
    inputMaxLenght,
    rateList,
    bankList,
    checkPermission,
    getBeforeDateStr,
    getBeforeDateTimestamp 
  }
</script>