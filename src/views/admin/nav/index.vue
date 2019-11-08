<template>
    <div>
        <div class="addbox">
            <a-button class="editable-add-btn" @click="handleAdd">Add</a-button>
        </div>
        <a-table :columns="columns" :dataSource="navlist">
            <template slot="action" slot-scope="text, record">
                <a-popconfirm
                        v-if="navlist.length"
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
            </template>
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
                            <!-- 位置id -->
                            <a-form-item
                                    label="位置ID"
                                    :label-col="{ span: 5 }"
                                    :wrapper-col="{ span: 12 }"
                            >
                                <a-select
                                        v-decorator="[
                    'position_id',
                    {
                      rules: [
                        {
                          required: true,
                          message: '请选择位置ID'
                        }
                      ]
                    }
                  ]"
                                        placeholder="Select a option and change input text above"
                                >
                                    <a-select-option
                                            v-for="(item, index) in position_obj"
                                            :value="item.id"
                                            :key="index"
                                    >
                                        {{ item.title }}
                                    </a-select-option>
                                </a-select>
                            </a-form-item>
                            <!--  标题-->
                            <a-form-item
                                    label="标题"
                                    :label-col="{ span: 5 }"
                                    :wrapper-col="{ span: 12 }"
                            >
                                <a-input
                                        placeholder="请输入标题"
                                        v-decorator="[
                    'title',
                    {
                      rules: [{ required: true, message: '标题不能为空!' }]
                    }
                  ]"
                                />
                            </a-form-item>
                            <!-- 图片 -->
                            <a-form-item
                                    label="图片"
                                    :label-col="{ span: 5 }"
                                    :wrapper-col="{ span: 12 }"
                            >
                                <a-input
                                        placeholder="请输入图片"
                                        v-decorator="[
                    'picture',
                    {
                      rules: [{ required: true, message: '图片不能为空' }]
                    }
                  ]"
                                />
                            </a-form-item>
                            <!-- type -->
                            <a-form-item
                                    label="链接类型"
                                    :label-col="{ span: 5 }"
                                    :wrapper-col="{ span: 12 }"
                            >
                                <a-select
                                        v-decorator="[
                    'link_type',
                    {
                      rules: [
                        {
                          required: true,
                          message: '请选择链接类型'
                        }
                      ]
                    }
                  ]"
                                        placeholder="Select a option and change input text above"
                                        @change="handleTypeChange"
                                >
                                    <a-select-option
                                            v-for="(item, index) in type_obj"
                                            :value="item.id"
                                            :key="index"
                                    >
                                        {{ item.title }}
                                    </a-select-option>
                                </a-select>
                            </a-form-item>
                            <!-- target -->
                            <a-form-item
                                    label="链接目标"
                                    :label-col="{ span: 5 }"
                                    :wrapper-col="{ span: 12 }"
                            >
                                <a-select
                                        v-decorator="[
                    'link_target',
                    {
                      rules: [
                        {
                          required: true,
                          message: '请选择链接目标'
                        }
                      ]
                    }
                  ]"
                                        placeholder="Select a option and change input text above"
                                >
                                    <a-select-option
                                            v-for="(item, index) in target_obj"
                                            :value="item.id"
                                            :key="index"
                                    >
                                        {{ item.name }}
                                    </a-select-option>
                                </a-select>
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
    import {stringify} from "querystring";
    import api from "../../../api.js";

    const columns = [
        {title: "ID", dataIndex: "id", key: "id"},
        {title: "位置ID", dataIndex: "position_id", key: "position_id"},
        {title: "标题", dataIndex: "title", key: "title"},
        {title: "图片", dataIndex: "picture", key: "picture"},
        {title: "链接类型", dataIndex: "link_type", key: "link_type"},
        {title: "链接目标", dataIndex: "link_target", key: "link_target"},
        {title: "创建时间", dataIndex: "created_at", key: "created_at"},
        {title: "更新时间", dataIndex: "updated_at", key: "updated_at"},
        {title: "操作", key: "action", scopedSlots: {customRender: "action"}}
    ];
    //位置id
    const position_obj = [
        {
            id: "1",
            title: "顶部导航"
        },
        {
            id: "2",
            title: "banner"
        },
        {
            id: "3",
            title: "图标"
        },
        {
            id: "4",
            title: "4张大图"
        }
    ];
    //链接类型
    const type_obj = [
        {
            id: "1",
            title: "商品分类页面"
        },
        {
            id: "2",
            title: "商品购买页面"
        },
        {
            id: "3",
            title: "商品活动页面"
        },
        {
            id: "4",
            title: "店铺"
        }
    ];
    var config = {
        headers: {
            "Authorization": localStorage.getItem("token")
        }
    };
    export default {
        data() {
            return {
                nav_id: "",
                navlist: [],
                catelist: [],
                prodlist: [],
                columns,
                loading: false,
                visible: false,
                position_obj,
                type_obj,
                target_obj: [],
                formLayout: "horizontal",
                form: this.$form.createForm(this, {name: "coordinated"})
            };
        },
        methods: {
            //删除导航
            onDelete(id) {
                const dataSource = [...this.navlist];
                this.navlist = dataSource.filter(item => item.id !== id);
                this.axios
                    .post(api.ip + "/nav/delete?id=" + id,{},config)
                    .then(data => {
                        console.log(data);
                        let msg = "";
                        if (data.status) {
                            msg = data.data.msg;
                        } else {
                            msg = data.data.msg;
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
                this.nav_id = id;
            },
            //提交方法
            handleOk() {
                this.loading = true;
                this.form.validateFields().then(data => {
                    this.axios
                        .post(api.ip + "nav/update?id=" + this.nav_id, stringify(data),config)
                        .then(info => {
                            console.log(info);
                            let msg = "";
                            if (info.status) {
                                msg = info.data.msg;
                            } else {
                                msg = info.data.msg;
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
            handleAdd() {
                const {count, dataSource} = this;
                const newData = {
                    key: count,
                    name: `Edward King ${count}`,
                    age: 32,
                    address: `London, Park Lane no. ${count}`
                };
                this.dataSource = [...dataSource, newData];
                this.count = count + 1;
            }
        },
        created() {
            //获取分类列表
            console.log(api.ip);
            let url = api.ip + "/category";
            console.log(url);
            this.axios
                .get(url, config)
                .then(data => {
                    this.catelist = data.data;
                    console.log(this.catelist);
                })
                .catch(error => {
                    return error;
                });
            //获取商品列表
            console.log(config);
            this.axios
                .get(api.ip + "/product", config)
                .then(data => {
                    this.prodlist = data.data;
                    console.log(this.prodlist);
                })
                .catch(error => {
                    return error;
                });
            //获取导航列表
            this.axios
                .get( api.ip + "/nav",config)
                .then(data => {
                    for (let i in data.data) {
                        data.data[i].key = i;
                        for (let j in position_obj) {
                            if (data.data[i].position_id == position_obj[j].id) {
                                data.data[i].position_id = position_obj[j].title;
                            }
                            if (data.data[i].link_type == position_obj[j].id) {
                                data.data[i].link_type = type_obj[j].title;
                            }
                        }

                        if (data.data[i].link_type == type_obj[0].title) {
                            for (let k in this.catelist) {
                                if (data.data[i].link_target == this.catelist[k].id) {
                                    data.data[i].link_target = this.catelist[k].name;
                                }
                            }
                        }
                        if (data.data[i].link_type == type_obj[1].title) {
                            for (let k in this.prodlist) {
                                if (data.data[i].link_target == this.prodlist[k].id) {
                                    data.data[i].link_target = this.prodlist[k].name;
                                }
                            }
                        }
                    }
                    this.navlist = data.data;
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
