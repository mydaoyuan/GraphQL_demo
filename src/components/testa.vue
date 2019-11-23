<template>
  <div>
    <div>-----------------</div>
    <h1>组件形式查询</h1>
    <!-- Apollo watched Graphql query -->
    <ApolloQuery :query="require('../graphql/test.gql')">
      <template slot-scope="{ result: { loading, error, data } }">
        <!-- Loading -->
        <div v-if="loading" class="loading apollo">Loading...</div>

        <!-- Error -->
        <div v-else-if="error" class="error apollo">An error occured</div>

        <!-- Result -->
        <div v-else-if="data" class="result apollo">{{ data }}</div>

        <!-- No result -->
        <div v-else class="no-result apollo">No result :(</div>
      </template>
    </ApolloQuery>

    <div>-----------------</div>
    <h1>监听变量，动态触发查询</h1>
    <div>
      <span>监听：</span>
      <input type="text" v-model="pingQuery" />
    </div>
    <div>查询返回结果： {{ ping }}</div>
    <div>-----------------</div>
    <h1>智能查询，动态触发</h1>
    <div>查询返回数据 :{{ featuredTag }}</div>
    <button @click="changeStatus">切换查询语句关键字: {{ showTag }}</button>
  </div>
</template>

<script>
import gql from 'graphql-tag';
export default {
  name: 'testa',
  apollo: {
    // 简单的查询，将更新 'ping' 这个 vue 属性
    ping: {
      query: gql`
        query PingMessage($message: String!) {
          ping(message: $message)
        }
      `,
      // 响应式参数
      variables() {
        // 在这里使用 vue 响应式属性
        return {
          message: this.pingQuery
        };
      }
    }
  },
  data() {
    return {
      pingQuery: 'pingQuery',
      showTag: 'random',
      featuredTag: ''
    };
  },
  created() {
    this.$apollo.addSmartQuery('featuredTag', {
      query() {
        // 这里你可以用'this' 访问组件实例
        if (this.showTag === 'last') {
          return gql`
            query PingMessage($message: String!) {
              ping(message: $message)
            }
          `;
        } else if (this.showTag === 'random') {
          return gql`
            query PingMessage {
              hello
            }
          `;
        }
        throw new Error('没有查询语句');
      },
      variables: {
        message: 'is MyMessage'
      },
      // 为 'featuredTag' 这个属性赋值
      update: data => data
    });
  },
  methods: {
    changeStatus() {
      if (this.showTag == 'random') {
        this.showTag = 'last';
      } else {
        this.showTag = 'random';
      }
    }
  }
};
</script>

<style scoped></style>
