<template>
    <div class="category">
        <a-table :columns="columns" :dataSource="catelist" rowKey="id">
            <a slot="name" slot-scope="text" href="javascript:;">{{ text }}</a>
            <span slot="customTitle"> <a-icon type="smile-o"/> Name</span>
            <span slot="property" slot-scope="property">
        <a-tag
                v-for="tag in property"
                :color="
            tag === '颜色' ? 'volcano' : tag === '口味' ? 'geekblue' : 'green'
          "
                :key="tag"
        >
          {{ tag.toUpperCase() }}
        </a-tag>
      </span>
            <span slot="action" slot-scope="record">
        <!-- 删除 -->
        <a-popconfirm
                v-if="catelist.length"
                title="确定删除吗?"
                @confirm="() => onDelete(record.id)"
        >
          <a class="delete-button" href="javascript:;">Delete</a>
        </a-popconfirm>
        <a
                class="edit-button"
                @click="showModal(record.id)"
                href="javascript:;"
        >
          Edit
        </a>
      </span>
        </a-table>
        <!-- 编辑框 -->
        <template>
            <p>
                <a-modal v-model="visible" title="编辑导航" onOk="handleOk">
                    <template slot="footer">
                        <a-button key="back" @click="handleCancel">Return</a-button>
                        <a-button
                                key="submit"
                                type="primary"
                                :loading="loading"
                                @click="handleOk"
                        >
                            Submit
                        </a-button>
                    </template>
                    <div>
                        <a-form :form="form">
                            <!--  标题-->
                            <a-form-item
                                    label="分类名"
                                    :label-col="{ span: 5 }"
                                    :wrapper-col="{ span: 12 }"
                            >
                                <a-input
                                        placeholder="请输入分类名"
                                        v-decorator="[
                    'name',
                    {
                      initialValue: cateName,
                      rules: [
                        {
                          required: true,
                          message: '分类名不能为空!'
                        }
                      ]
                    }
                  ]"
                                />
                            </a-form-item>
                            <!-- 属性1 -->
                            <a-form-item
                                    label="商品的属性1"
                                    :label-col="{ span: 5 }"
                                    :wrapper-col="{ span: 12 }"
                            >
                                <a-input
                                        placeholder="请输入属性1"
                                        v-decorator="[
                    'attr1',
                    {
                      initialValue: propertyList[0]
                    }
                  ]"
                                />
                            </a-form-item>
                            <!-- 属性2 -->
                            <a-form-item
                                    label="商品的属性2"
                                    :label-col="{ span: 5 }"
                                    :wrapper-col="{ span: 12 }"
                            >
                                <a-input
                                        placeholder="请输入属性2"
                                        v-decorator="[
                    'attr2',
                    {
                      initialValue: propertyList[1]
                    }
                  ]"
                                />
                            </a-form-item>
                            <!-- 属性3 -->
                            <a-form-item
                                    label="商品的属性3"
                                    :label-col="{ span: 5 }"
                                    :wrapper-col="{ span: 12 }"
                            >
                                <a-input
                                        placeholder="请输入属性3"
                                        v-decorator="[
                    'attr3',
                    {
                      initialValue: propertyList[2]
                    }
                  ]"
                                />
                            </a-form-item>
                            <!-- 排序-->
                            <a-form-item
                                    label="排序"
                                    :label-col="{ span: 5 }"
                                    :wrapper-col="{ span: 12 }"
                            >
                                <a-input
                                        placeholder="请输入排序"
                                        v-decorator="[
                    'sort',
                    {
                      initialValue: sort,
                      rules: [
                        {
                          pattern: new RegExp(/^[0-9]*$/),
                          message: '只能输入数字!'
                        }
                      ]
                    }
                  ]"
                                />
                            </a-form-item>
                        </a-form>
                    </div>
                </a-modal>
            </p>
        </template>
    </div>
</template>

<script>
    import {message} from "ant-design-vue";
    import qs from "qs";
    import ip from "../../../api.js";

    const columns = [
        {title: "ID", dataIndex: "id", key: "id"},
        {title: "分类名", dataIndex: "name", key: "name"},
        {
            title: "属性",
            dataIndex: "property",
            key: "property",
            scopedSlots: {customRender: "property"}
        },
        {title: "排序", dataIndex: "sort", key: "sort"},
        {title: "操作", key: "action", scopedSlots: {customRender: "action"}}
    ];

    export default {
        data() {
            return {
                cateId: "",
                catelist: [],
                prodlist: [],
                propertyList: [],
                cateName: "",
                sort: 0,
                columns,
                loading: false,
                visible: false,
                target_obj: [],
                formLayout: "horizontal",
                form: this.$form.createForm(this, {name: "name,attr1,attr2,attr3"})
            };
        },
        methods: {
            //删除分类
            onDelete(id) {
                let config = {
                    headers: {
                        "Authorization": localStorage.getItem("token")
                    }
                };
                const dataSource = [...this.catelist];
                this.catelist = dataSource.filter(item => item.id !== id);
                console.log(id);
                let url = ip.ip + "/category/delete?id=" + id;
                this.axios
                    .post(url, {}, config)
                    .then(data => {
                        console.log(data);
                        let msg = "";
                        if (data.status) {
                            msg = "删除成功";
                        } else {
                            msg = "删除失败";
                        }
                        message.info(msg);
                    })
                    .catch(error => {
                        console.log(error);
                        return error;
                    });
            },
            //打开编辑框
            showModal(id) {
                this.visible = true;
                console.log(id);
                console.log(this.catelist);
                this.cateId = id;
                for (let i in this.catelist) {
                    if (this.catelist[i].id == id) {
                        this.cateName = this.catelist[i].name;
                        this.propertyList = this.catelist[i].property;
                        this.sort = this.catelist[i].sort;
                    }
                }
                console.log(this.propertyList);
                console.log(this.cateName);
            },
            //编辑
            handleOk() {
                let config = {
                    headers: {
                        "Authorization": localStorage.getItem("token")
                    }
                };
                this.loading = true;
                this.form.validateFields().then(data => {
                    console.log(data);
                    data.property = JSON.stringify({
                        attr1: data.attr1,
                        attr2: data.attr2,
                        attr3: data.attr3
                    });
                    delete data.attr1;
                    delete data.attr2;
                    delete data.attr3;
                    console.log(data);
                    this.axios
                        .post(
                            ip.ip + "/category/update?id=" + this.cateId,
                            qs.stringify(data), config
                        )
                        .then(info => {
                            console.log(info);
                            let msg = "";
                            if (info.status) {
                                msg = "编辑成功";
                            } else {
                                msg = "编辑失败";
                            }
                            this.visible = false;
                            this.loading = false;
                            message.info(msg);
                            window.location.reload();
                        })
                        .catch(error => {
                            return error;
                        });
                });
            },
            //取消编辑
            handleCancel() {
                this.visible = false;
            },
            handleTypeChange(value) {
                console.log(value);
                if (value == 1) {
                    this.target_obj = this.catelist;
                } else if (value == 2) {
                    this.target_obj = this.prodlist;
                } else if (value == 3) {
                    this.target_obj = [{id: 1, name: "神秘双十一活动"}];
                } else if (value == 4) {
                    this.target_obj = [{id: 1, name: "Vans"}];
                } else {
                    this.target_obj = [{id: 1, name: "暂无"}];
                }
            },
            //分页
            onChange(page, pageSize) {
                let config = {
                    headers: {
                        "Authorization": localStorage.getItem("token")
                    }
                };
                console.log(page);
                console.log(pageSize);
                this.axios
                    .get(ip.ip + "/category", {
                        params: {
                            page: page
                        }, config
                    })
                    .then(data => {
                        console.log(data);
                        //清空分类列表的数据
                        this.catelist = [];
                        //设置分页总数
                        this.total = data.data.total;
                        //设置每页条数
                        this.pageSize = data.data.per_page;
                        //循环分类数据
                        for (let i in data.data.data) {
                            let tags = [];
                            let arr = [];
                            arr = JSON.parse(data.data.data[i].property);
                            for (let j in arr) {
                                tags.push(arr[j]);
                            }
                            data.data.data[i].property = tags;
                            console.log(data.data.data[i]);
                            this.catelist.push(data.data.data[i]);
                        }
                        console.log(this.catelist);
                    })
                    .catch(error => {
                        return error;
                    });
            }
        },
        created() {
            let config = {
                headers: {
                    "Authorization": localStorage.getItem("token")
                }
            };
            //获取分类列表
            this.axios
                .get(ip.ip + "/category", config)
                .then(data => {
                    console.log(data);
                    //循环分类数据
                    for (let i in data.data) {
                        let tags = [];
                        let arr = [];
                        arr = JSON.parse(data.data[i].property);
                        for (let j in arr) {
                            tags.push(arr[j]);
                        }
                        data.data[i].property = tags;
                        console.log(data.data[i]);
                        console.log(data.data[i].property);
                        this.catelist.push(data.data[i]);
                    }
                    console.log(this.catelist);
                })
                .catch(error => {
                    return error;
                });
        }
    };
</script>
<style scoped>
    .delete-button {
        margin-right: 15px;
    }

    .editable-cell-icon:hover,
    .editable-cell-icon-check:hover {
        color: #108ee9;
    }

    .editable-add-btn {
        margin-bottom: 8px;
        display: block;
        margin-left: 11px;
        margin-top: 10px;
    }
</style>
