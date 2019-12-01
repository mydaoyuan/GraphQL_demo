<template>
  <div>
    <ApolloQuery :query="require('../graphql/Messages.gql')">
      <template slot-scope="{ result: { loading, error, data } }">
        <!-- Loading -->
        <div v-if="loading" class="loading apollo">Loading...</div>

        <!-- Error -->
        <div v-else-if="error" class="error apollo">An error occured</div>

        <!-- Result -->
        <div v-else-if="data && data.messages" class="result apollo">
          <div v-for="item in data.messages" :key="item.id">
            <div>
              {{ item }}
            </div>
          </div>
        </div>

        <!-- No result -->
        <div v-else class="no-result apollo">No result :(</div>
      </template>
    </ApolloQuery>
    <div>
      <h1>增加一个message</h1>
      message:
      <input type="text" v-model="newMessage" />
      <button @click="add">add</button>
    </div>
  </div>
</template>

<script>
import addMessages from '../graphql/AddMessage.gql';
export default {
  data() {
    return {
      newMessage: ''
    };
  },
  methods: {
    async add() {
      await this.$apollo.mutate({
        // 查询语句
        mutation: addMessages,
        // 参数
        variables: {
          input: { text: this.newMessage }
        }
      });
      alert('新增成功！');
    }
  }
};
</script>

<style lang="scss" scoped></style>
