<template>
    <a-table :columns="columns" :dataSource="data" bordered>
        <template
                v-for="col in ['category_id', 'name', 'sale_num', 'sort']"
                :slot="col"
                slot-scope="text, record"
        >
            <div :key="col">
                <a-input
                        v-if="record.editable"
                        style="margin: -5px 0"
                        :value="text"
                        @change="e => handleChange(e.target.value, record.key, col)"
                />
                <template v-else>{{ text }}</template>
            </div>
        </template>
        <template slot="action" slot-scope="text, record">
            <div class="editable-row-operations">
        <span v-if="record.editable">
          <a @click="() => save(record.key)">Save</a>
          <a-popconfirm
                  title="Sure to cancel?"
                  @confirm="() => cancel(record.key)"
          >
            <a>Cancel</a>
          </a-popconfirm>
        </span>
                <span v-else>
          <a @click="() => edit(record.key)">Edit</a>
        </span>
                <span>
          <a-popconfirm
                  v-if="data.length"
                  title="Sure to delete?"
                  @confirm="() => onDelete(record.key)"
          >
            <a href="javascript:;">Delete</a>
          </a-popconfirm>
        </span>
            </div>
        </template>
    </a-table>
</template>

<script>
    import {message} from "ant-design-vue";
    // import { stringify } from "querystring";
    import ip from "../../../api.js";

    const data = [];
    const columns = [
        {
            title: "ID",
            dataIndex: "id",
            key: "id",
            width: "10%",
            scopedSlots: {customRender: "id"}
        },
        {
            title: "分类ID",
            dataIndex: "category_id",
            key: "category_id",
            width: "10%",
            scopedSlots: {customRender: "category_id"}
        },
        {
            title: "商品名",
            dataIndex: "name",
            key: "name",
            width: "40%",
            scopedSlots: {customRender: "name"}
        },
        {
            title: "销量",
            dataIndex: "sale_num",
            key: "sale_num",
            width: "10%",
            scopedSlots: {customRender: "sale_num"}
        },
        {
            title: "排序",
            dataIndex: "sort",
            key: "sort",
            width: "10%",
            scopedSlots: {customRender: "sort"}
        },
        {title: "操作", key: "action", scopedSlots: {customRender: "action"}}
    ];

    export default {
        data() {
            this.cacheData = data.map(item => ({...item}));
            return {
                data,
                columns
            };
        },
        methods: {
            handleChange(value, key, column) {
                const newData = [...this.data];
                const target = newData.filter(item => key === item.key)[0];
                if (target) {
                    target[column] = value;
                    this.data = newData;
                }
            },
            edit(key) {
                const newData = [...this.data];
                const target = newData.filter(item => key === item.key)[0];
                this.$router.push({
                    path: "/admin/product/edit",
                    query: {
                        data: target
                    }
                });
                if (target) {
                    target.editable = true;
                    this.data = newData;
                }
            },
            save(key) {
                const newData = [...this.data];
                const target = newData.filter(item => key === item.key)[0];
                console.log(target);
                console.log(key);
                this.$router.push({path: "/admin/product/edit" + key});
                if (target) {
                    delete target.editable;
                    this.data = newData;
                    this.cacheData = newData.map(item => ({...item}));
                }
            },
            cancel(key) {
                const newData = [...this.data];
                const target = newData.filter(item => key === item.key)[0];
                if (target) {
                    Object.assign(
                        target,
                        this.cacheData.filter(item => key === item.key)[0]
                    );
                    delete target.editable;
                    this.data = newData;
                }
            },
            //删除商品
            onDelete(key) {
                let config = {
                    headers: {
                        "Authorization": localStorage.getItem("token")
                    }
                };
                this.axios
                    .post(ip.ip + "/product/delete?id=" + key, {}, config)
                    .then(data => {
                        console.log(data);
                        let msg = "";
                        if (data.status) {
                            msg = "删除成功";
                            const dataSource = [...this.data];
                            this.data = dataSource.filter(item => item.key !== key);
                        } else {
                            msg = "删除失败";
                        }
                        message.info(msg);
                    })
                    .catch(error => {
                        message.info("删除失败");
                        return error;
                    });
            }
        },
        created() {
            let data2 = localStorage.getItem("token");
            let config = {
                headers: {
                    "Authorization": localStorage.getItem("token")
                }
            };
            console.log(data2);
            this.data = [];
            this.axios
                .get(ip.ip + "/product", config)
                .then(data => {
                    for (let i in data.data) {
                        this.data.push(data.data[i]);
                    }
                    console.log(data);
                    console.log(this.data);
                    for (let j in this.data) {
                        this.data[j].key = this.data[j].id;
                    }
                    console.log(this.data);
                })
                .catch(error => {
                    return error;
                });
        }
    };
</script>
<style scoped>
    .editable-row-operations a {
        margin-right: 8px;
    }
</style>
