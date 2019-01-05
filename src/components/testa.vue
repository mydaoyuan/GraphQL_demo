<template>
  <div>
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

    <div>featuredTag :{{featuredTag}}</div>
    <button @click="changeStatus">changeData current: {{showTag}}</button>
    <input type="text" v-model="pingInput">
    {{ping}}
    <!-- <ApolloMutation :mutation="require('../graphql/addTest.gql')" :variables="{
        testInput: {
          value: myvalue,
        },
      }" class="form" @done="myvalue = ''">
      <template slot-scope="{ mutate }">
        <form v-on:submit.prevent="mutate()">
          <label for="field-message">Message</label>
          <input id="field-message" v-model="myvalue" placeholder="Type a message" class="input">
        </form>
      </template>
    </ApolloMutation>-->
  </div>
</template>

<script>
import gql from 'graphql-tag'
export default {
  name: 'testa',
  apollo: {
    // 简单的查询，将更新 'hello' 这个 vue 属性
    // featuredTag: ,
    ping: {
      query: gql`query PingMessage($message: String!) {
      ping(message: $message)
    }`,
      // 响应式参数
      variables() {
        // 在这里使用 vue 响应式属性
        return {
          message: this.pingInput,
        }
      },
    },
  },
  data() {
    return {
      myvalue: '',
      hello: '',
      a: '',
      showTag: 'random',
      featuredTag: '',
      pingInput: '33'
    }
  },
  created() {
    this.$apollo.addSmartQuery('featuredTag', {
      query() {
        console.log(this.showTag);
        // 这里你可以用'this' 访问组件实例
        if (this.showTag === 'last') {
          return gql`
          query PingMessage($message: String!) {
            a:ping(message: $message)
          }`
        } else if (this.showTag === 'random') {
          return gql`query my{a:hello}`
        }
      },
      variables: {
        message: 'MyMessage'
      },
      // 为 'featuredTag' 这个组件属性赋值
      update: data => data.randomTag || data.lastTag,
    })
  },
  methods: {
    changeStatus() {
      if (this.showTag == 'random') {
        this.showTag = 'lastTag'
      } else {
        this.showTag = 'random'
      }
    }
  }
}
</script>

<style scoped>
</style>
