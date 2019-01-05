<template>
  <div>
    tag:
    <input type="text" v-model="newTag">
    <div>this is tags:
      <div v-for="tag in tags" :key="tag.id">{{ tag.label }}</div>
    </div>
    <button @click="addTag">add tag</button>
    <div>
      <h2>message</h2>
      <input type="text" v-model="newmessage">
      <button @click="addMessage">add newmessage</button>
      <div>Messages List</div>
      <div v-for="(message, i) in messages" :key="message.id">{{i}}、{{ message.text }}</div>
    </div>
  </div>
</template>

<script>
import TAGS_QUERY from '../graphql/tags.gql';
import Messages from '../graphql/Messages.gql';
import addMessage from '../graphql/AddMessage.gql';
import AddTags from '../graphql/AddTags.gql';
export default {
  data() {
    return {
      newTag: '',
      tags: [],
      newmessage: ''
    }
  },
  apollo: {
    tags: TAGS_QUERY,
    messages: Messages
  },
  methods: {
    addTag() {
      // 保存用户输入以防止错误
      const newTag = this.newTag
      // 将其清除以尽早更新用户页面
      this.newTag = ''
      // 调用 graphql 变更
      this.$apollo.mutate({
        // 查询语句
        mutation: AddTags,
        // 参数
        variables: {
          label: newTag,
        },
        // 用结果更新缓存
        // 查询将先通过乐观响应、然后再通过真正的变更结果更新
        update: (store, { data: { addTag } }) => {
          // 从缓存中读取这个查询的数据
          const data = store.readQuery({ query: TAGS_QUERY })
          // 将变更中的标签添加到最后
          data.tags.push(addTag)
          // 将数据写回缓存
          store.writeQuery({ query: TAGS_QUERY, data })
        },
        // 乐观 UI
        // 将在请求产生时作为“假”结果，使用户界面能够快速更新
        optimisticResponse: {
          __typename: 'Mutation',
          addTag: {
            __typename: 'Tag',
            id: -1,
            label: newTag,
          },
        },
      }).then((data) => {
        // 结果
        console.log(data)
      }).catch((error) => {
        // 错误
        console.error(error)
        // 恢复初始用户输入
        this.newTag = newTag
      })
    },
    addMessage() {
      const newMessage = this.newmessage
      this.newmessage = ''
      this.$apollo.mutate({
        // 查询语句
        mutation: addMessage,
        // 参数
        variables: {
          input: {
            text: newMessage,
          }
        },
        // 用结果更新缓存
        // 查询将先通过乐观响应、然后再通过真正的变更结果更新
        update: (store, { data: { addMessage } }) => {
          // 从缓存中读取这个查询的数据
          const data = store.readQuery({ query: Messages })
          // 将变更中的标签添加到最后
          data.messages.push(addMessage)
          // 将数据写回缓存
          store.writeQuery({ query: Messages, data })
        },
        // 乐观 UI
        // 将在请求产生时作为“假”结果，使用户界面能够快速更新
        optimisticResponse: {
          __typename: 'Mutation',
          addMessage: {
            __typename: 'Message',
            id: -1,
            text: newMessage,
          },
        },
      }).catch((error) => {
        // 错误
        console.error(error)
        // 恢复初始用户输入
        this.newmessage = newMessage
      })
    }
  },
}
</script>

<style scoped>
</style>
