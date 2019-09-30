<template>
  <div class="child-game">
    <div class="gamediv shadow">
      <h3>已添加游戏(拖拽排列游戏顺序)</h3>
      <div class="yetadd gamelist" >
        <ul>
          <li v-for="item in slectGameTop" :key="item" ref="topGameList">
            <div class="gameimg" 
                draggable="true"
                @dragstart="handleDragStart"
                @dragover="handleDragOver"
                @dragend="handleDragEnd"
                @drop="handleDrop"
                @dragenter="handleDragEnter"
                @click="handleMoveGame(item)">
              <img :src="'/src/assets/game/'+item+'.png'" :data-id="item" >
            </div>
          </li>
        </ul>
      </div>
      <div class="yetadd gamelist">
        <ul>
          <li v-for="item in slectGameBottom" :key="item" ref="bottomGameList">
            <div class="gameimg" 
                  draggable="true"
                  @dragstart="handleDragStart"
                  @dragover="handleDragOver"
                  @dragend="handleDragEnd"
                  @drop="handleDrop"
                  @dragenter="handleDragEnter" 
                  @click="handleMoveGame(item)">
              <img :src="'/src/assets/game/'+item+'.png'" :data-id="item">
            </div>
          </li>
        </ul>
      </div>
    </div>
    <div>{{slectGameTop}}</div>
    <div>{{slectGameBottom}}</div>
    <div class="gamediv shadow">
      <h3>可添加游戏(点击添加游戏)</h3>
      <div class="notadd gamelist">
        <ul>
          <li v-for="item in gameList" :key="item">
            <div class="gameimg " v-if="!checkGameExist(item)">
              <img
                :src="'/src/assets/game/'+item+'.png'"
                alt
                @click="handleAddGame(item)"
              >
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
let fromDom = null,
    toDom = null,
    lastDom = null;
export default {
  name: "ChildGame",
  props: {
    selectGame: {
      type: String,
      default: "31,32,33,34,35,36,37"
    },
  },
  data() {
    return {
      slectedGameArray:this.selectGame ? this.selectGame.split(',') : [],//已经选好的游戏数组
      slectGameTop: [],//第一行选中游戏
      slectGameBottom: [],//第二行选中游戏
      gameList: [1, 3, 4, 5, 10, 12, 13, 16, 17, 18,19,20,21,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37]
    };
  },
  created() {
    console.log(this.selectGame)
    this.stringArrTransferIntArr();
  },
  methods: {
    handleDragStart(event){
      console.log("dragStart")
      lastDom = fromDom = event.currentTarget;
    },
    handleDragOver(event){
      //console.log("dragOver")
      event.preventDefault();
      event.dataTransfer.effectAllowed = "move";
    },
    handleDragEnd(event){
      console.log("end")
      // event.currentTarget.style.border = "2px dashed transparent";
      // event.currentTarget.style.opacity = "";
      toDom = null;
    },
    handleDrop(event){
      console.log("drop")
      
      fromDom = null;
      toDom = null;
    },
    testConfirm(){
      this.formatSelectGame()
    },
    handleDragEnter(event){
      //console.log("dragEnter")
      toDom = event.currentTarget;
      if(fromDom == lastDom){
          //第一次调换
          this.swapDom(lastDom, toDom);
          lastDom = toDom;
      }else{
          //第N+1次调换，要先把上一个div的东西还原回去，再跟第三个div互换
          //这个防止enter多次触发
          if(lastDom == toDom){return;}
          this.swapDom(fromDom,lastDom);
          this.swapDom(fromDom,toDom);
          lastDom = toDom;
      }
    },
    swapDom(a, b) {
      //a和b的innerHTML互换
      let temp = a.innerHTML;
      a.innerHTML = b.innerHTML;
      b.innerHTML = temp;
    },
    //点击添加游戏
    handleAddGame(id) {
      if(this.slectGameTop.length == 10 && this.slectGameBottom.length == 10){
        this.$message.success("最多只能添加20个游戏")
        return;
      }
      if (this.slectGameTop.length == this.slectGameBottom.length) {
        this.slectGameTop.push(+id);
      } else if (this.slectGameTop.length > this.slectGameBottom.length) {
        this.slectGameBottom.push(+id);
      } else {
        this.slectGameTop.push(+id);
      }
      
      this.slectedGameArray = this.crossConnetArray(this.slectGameTop,this.slectGameBottom);
    },
    //编辑时候重组已经选中的游戏
    rebuildSelectedData(){
      console.log("一进来重组选中的游戏",this.slectedGameArray)
      const selectGameArray = this.slectedGameArray;
      this.slectGameTop = [];
      this.slectGameBottom = [];
      for (var i = 0; i < selectGameArray.length; i++) {
        if(i % 2 == 0){
          this.slectGameTop.push(+selectGameArray[i]);
        }else{
          this.slectGameBottom.push(+selectGameArray[i]);
        }
      }
    },
    //重组已经选好并排序好的游戏通知父组件
    formatSelectGame(){
      //this.$nextTick(() => {
        const topGameArray = [];
        const bottomGameArray = [];
        const topGameDom = this.$refs.topGameList;
        console.log(topGameDom[0].childNodes[0].childNodes[0].dataset.id)
        const bottomGameDom = this.$refs.bottomGameList;
        for (let i = 0; i < topGameDom.length; i++) {
          topGameArray.push(+topGameDom[i].childNodes[0].childNodes[0].dataset.id)
        }
        for (let i = 0; i < bottomGameDom.length; i++) {
          bottomGameArray.push(+bottomGameDom[i].childNodes[0].childNodes[0].dataset.id)
        }
        this.slectedGameArray = this.crossConnetArray(topGameArray,bottomGameArray);
        console.log("重组已选择确认顺序的游戏",this.slectedGameArray)
     // });
    },
    //将两个数组交错拼接成一个数组
    crossConnetArray(firstArr,secondArr){
      var [...tempFirst] = firstArr;
      var [...tempSecond] = secondArr;
      tempSecond.forEach(function (item, index) {
        tempFirst.splice((index + 1) + index, 0, item);
      });
      console.log("交错拼接之后的数组",firstArr)

      return tempFirst;
    },
    //点击移除已选择游戏
    handleMoveGame(id){
      console.log(this.slectedGameArray)
      var index = this.slectedGameArray.indexOf(id);
      if (index > -1) {
        this.slectedGameArray.splice(index, 1);
        console.log(this.slectedGameArray)
        this.rebuildSelectedData()
      }
    },
    //检查待选择的游戏是否已经被选择
    checkGameExist(id) {
      return this.slectGameBottom.indexOf(id) > -1 || this.slectGameTop.indexOf(id) > -1;
    },
    //将字符串数组转变为数值数组
    stringArrTransferIntArr(){
      if(this.slectedGameArray){
        console.log("字符串数组",this.slectedGameArray)
        var dataIntArr = [];
        this.slectedGameArray.forEach(function(data,index,arr){
          dataIntArr.push(+data);
        });
        this.slectedGameArray = dataIntArr;
      }
      console.log("数值数组",dataIntArr)
      this.rebuildSelectedData()
    }
  }
};
</script>

<style scoped>
.child-game {
   width: 100%;
}
.gamediv { width: 100%; margin-bottom: 20px; border-radius: 4px; padding: 0 20px; padding-bottom: 10px; display: inline-block;}
.gamediv h3 { width: 100%; line-height: 46px; border-bottom: 2px dashed #bbb;color: #79bbff; font-size: 18px; margin-top: 0; margin-bottom: 10px; text-align: center}
.gamelist { width: 100%; display: inline-block; float: left;}
.gamelist ul { padding-left: 0; width: 100%; display: inline-block; margin: 0; float: left;}
.gamelist ul li { width: 10%; padding: 6px;list-style:none; float: left; text-align: center; display: inline-block}
.gameimg { width: 90%; margin: 0 auto; display: inline-block; float: left;}
.gameimg img { width: 100%; float: left;}
.red{
  background-color: red
}

</style>
