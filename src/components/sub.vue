<template>
  <div>
    <button @click="skipSubscription = !skipSubscription">
      {{ skipSubscription ? "继续订阅" : "停止订阅" }}
    </button>
    <div v-for="message in messages" :key="message.id">{{ message.text }}</div>
  </div>
</template>

<script>
import Messages from '../graphql/Messages.gql';
import MessageAdded from '../graphql/MessageAdded.gql';
export default {
  data() {
    return {
      skipSubscription: false
    };
  },
  apollo: {
    messages: {
      query: Messages
      // 订阅更多 适合初始化大量数据，后续少量数据修改的情况
      // subscribeToMore: [{
      //   document: MessageAdded,
      //   // 在这里用之前的结果和新数据组合成新的结果
      //   updateQuery: (prevData, { subscriptionData: { data: { messageAdded } } }) => {
      //     console.log(messageAdded, 'newdata');
      //     prevData.messages.push(messageAdded)
      //   }
      // }]
    },
    $subscribe: {
      // 当添加一个标签时
      whenAddMessage: {
        query: MessageAdded,
        // 响应式变量
        // variables() {
        //   // 像常规查询一样运作
        //   // 在每次改变值时都会使用正确的变量重新订阅
        //   return {
        //     type: this.type,
        //   }
        // },
        // 结果钩子
        result({ data }) {
          console.log(data, '我监听到了');
          this.messages.push(data.messageAdded);
        },
        // 跳过这个订阅
        skip() {
          return this.skipSubscription;
        }
      }
    }

    // subscribeToMore: {
    //   document: gql`subscription name($param: String!) {
    //     itemAdded(param: $param) {
    //       id
    //       label
    //     }
    //   }`,
    //   // 传递给订阅的变量
    //   // 由于我们使用了函数，因此它们是响应式的
    //   variables () {
    //     return {
    //       param: this.param,
    //     }
    //   },
    //   // 变更之前的结果
    //   updateQuery: (previousResult, { subscriptionData }) => {
    //     // 在这里用之前的结果和新数据组合成新的结果
    //   },
    // }
  }
};
</script>

<style scoped></style>
