<template>
  <div>
    tag:
    <input type="text" v-model="newTag" />
    <button @click="addTag">add tag</button>
    <br />
    <br />
    <div>
      存储的tag是:
      <div v-for="tag in tags" :key="tag.id">
        {{ tag.label }} || id是 {{ tag.id }}
      </div>
    </div>
    <div>-----------------</div>
    <div>
      修改ID： <input type="text" v-model="modify.id" />
      <br />
      <br />
      修改内容： <input type="text" v-model="modify.label" />
      <button @click="modifyItem">确认修改</button>
    </div>
    <div>-----------------</div>
    <div>
      删除ID： <input type="text" v-model="delId" />
      <button @click="delItem">确认删除</button>
    </div>
  </div>
</template>

<script>
import TAGS_QUERY from '../graphql/tags.gql';
import Messages from '../graphql/Messages.gql';
import AddTags from '../graphql/AddTags.gql';
import ModifyTags from '../graphql/ModifyTags.gql';
import DelTags from '../graphql/DelTags.gql';
export default {
  data() {
    return {
      newTag: '',
      modify: { id: '', label: '' },
      delId: '',
      tags: [],
      newmessage: ''
    };
  },
  apollo: {
    tags: TAGS_QUERY,
    messages: Messages
  },
  methods: {
    addTag() {
      // 保存用户输入以防止错误
      const newTag = this.newTag;
      // 将其清除以尽早更新用户页面
      this.newTag = '';
      // 调用 graphql 变更
      this.$apollo
        .mutate({
          // 查询语句
          mutation: AddTags,
          // 参数
          variables: {
            label: newTag
          },
          // 用结果更新缓存
          // 查询将先通过乐观响应、然后再通过真正的变更结果更新
          update: (store, { data: { addTag } }) => {
            // 从缓存中读取这个查询的数据
            const data = store.readQuery({ query: TAGS_QUERY });
            // 将变更中的标签添加到最后
            data.tags.push(addTag);
            // 将数据写回缓存
            store.writeQuery({ query: TAGS_QUERY, data });
          },
          // 乐观 UI
          // 将在请求产生时作为“假”结果，使用户界面能够快速更新
          optimisticResponse: {
            __typename: 'Mutation',
            addTag: {
              __typename: 'Tag',
              id: -1,
              label: newTag
            }
          }
        })
        .then(data => {
          // 结果
          console.log(data);
        })
        .catch(error => {
          // 错误
          console.error(error);
          // 恢复初始用户输入
          this.newTag = newTag;
        });
    },
    async modifyItem() {
      const { data } = await this.$apollo.mutate({
        // 查询语句
        mutation: ModifyTags,
        // 参数
        variables: {
          input: this.modify
        },
        // 用结果更新缓存
        // 查询将先通过乐观响应、然后再通过真正的变更结果更新
        update: (store, { data: { id, label } }) => {
          // 从缓存中读取这个查询的数据
          const data = store.readQuery({ query: TAGS_QUERY });
          data.tags.map(item => {
            if (item.id == id) {
              return { id, label };
            }
            return item;
          });
          // 将数据写回缓存
          store.writeQuery({ query: TAGS_QUERY, data });
        }
        // 乐观 UI
        // 将在请求产生时作为“假”结果，使用户界面能够快速更新
        // optimisticResponse: {
        //   __typename: 'Mutation',
        //   addTag: {
        //     __typename: 'Tag',
        //     id: -1,
        //     label: newTag
        //   }
        // }
      });
      if (data.updateTag.error == 0) {
        alert('修改成功');
        this.$apollo.queries.tags.refetch();
      } else {
        alert('修改失败');
      }
      console.log(data);
    },
    async delItem() {
      if (!this.delId) {
        alert('请输入ID');
        return;
      }
      const { data } = await this.$apollo.mutate({
        // 查询语句
        mutation: DelTags,
        // 参数
        variables: {
          id: this.delId
        }
        // 用结果更新缓存
        // 查询将先通过乐观响应、然后再通过真正的变更结果更新
        // update: (store, { data: { id, label } }) => {
        //   // 从缓存中读取这个查询的数据
        //   const data = store.readQuery({ query: TAGS_QUERY });
        //   data.tags.map(item => {
        //     if (item.id == id) {
        //       return { id, label };
        //     }
        //     return item;
        //   });
        //   // 将数据写回缓存
        //   store.writeQuery({ query: TAGS_QUERY, data });
        // }
        // 乐观 UI
        // 将在请求产生时作为“假”结果，使用户界面能够快速更新
        // optimisticResponse: {
        //   __typename: 'Mutation',
        //   addTag: {
        //     __typename: 'Tag',
        //     id: -1,
        //     label: newTag
        //   }
        // }
      });
      if (data.delTag.error == 0) {
        alert('删除成功');
        this.delId = '';
        this.$apollo.queries.tags.refetch();
      } else {
        alert('删除失败');
      }
      console.log(data);
    }
  }
};
</script>

<style scoped></style>
