<template>
    <a-layout-content id="nav-add" style="margin: 0 16px">
        <a-form :form="form">
            <!-- 分类id -->
            <a-form-item
                    label="分类id"
                    :label-col="{ span: 5 }"
                    :wrapper-col="{ span: 12 }"
            >
                <a-select
                        v-decorator="[
            'category_id',
            {
              initialValue: datas.category_id,
              rules: [
                {
                  required: true,
                  message: '请选择分类id'
                }
              ]
            }
          ]"
                        placeholder="请选择商品分类"
                        @change="handleCateChange"
                >
                    <a-select-option
                            v-for="(item, index) in catelist"
                            :value="item.id"
                            :key="index"
                    >
                        {{ item.name }}
                    </a-select-option>
                </a-select>
            </a-form-item>
            <!-- 商品名 -->
            <a-form-item
                    label="商品名"
                    :label-col="{ span: 5 }"
                    :wrapper-col="{ span: 12 }"
            >
                <a-input
                        v-decorator="[
            'name',
            {
              initialValue: datas.name,
              rules: [{ required: true, message: '商品名不能为空！' }]
            }
          ]"
                >
                </a-input>
            </a-form-item>
            <!-- 商品属性 -->
            <a-form-item
                    label="商品库存"
                    :label-col="{ span: 5 }"
                    :wrapper-col="{ span: 12 }"
            >
                <a-table :columns="columns" :dataSource="data" bordered>
                    <template
                            v-for="col in [
              'attr1',
              'attr2',
              'quantity',
              'original_price',
              'price'
            ]"
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
                            <template v-else
                            >{{ text }}
                            </template>
                        </div>
                    </template>
                    <template slot="operation" slot-scope="text, record">
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
                        </div>
                    </template>
                </a-table>
            </a-form-item>

            <!--  商品的描述-->
            <a-form-item
                    label="商品描述"
                    :label-col="{ span: 5 }"
                    :wrapper-col="{ span: 12 }"
            >
                <a-textarea
                        placeholder="Basic usage"
                        :rows="10"
                        v-decorator="[
            'content',
            {
              initialValue: datas.content,
              rules: [{ required: true, message: '商品名不能为空！' }]
            }
          ]"
                />
            </a-form-item>
            <!-- 宣传语 -->
            <a-form-item
                    label="宣传语"
                    :label-col="{ span: 5 }"
                    :wrapper-col="{ span: 12 }"
            >
                <a-input
                        v-decorator="[
            'type1',
            {
              initialValue: type1
            }
          ]"
                ></a-input>
            </a-form-item>
            <!-- 生产日期 -->
            <a-form-item
                    :label-col="{ span: 5 }"
                    :wrapper-col="{ span: 12 }"
                    label="原生产日期"
            >
                {{ type2 }}
            </a-form-item>
            <!-- 生产日期 -->
            <a-form-item
                    :label-col="{ span: 5 }"
                    :wrapper-col="{ span: 12 }"
                    label="修改生产日期"
                    has-feedback
                    validate-status="warning"
            >
                <a-date-picker
                        @change="onChange"
                        showToday
                        style="width: 100%"
                        v-decorator="['type2']"
                />
            </a-form-item>
            <!-- 图片 -->
            <a-form-item
                    label="图片"
                    :label-col="{ span: 5 }"
                    :wrapper-col="{ span: 12 }"
            >
                <img class="image" :src="type3"/>
                <a-input
                        v-decorator="[
            'type3',
            {
              initialValue: type3
            }
          ]"
                ></a-input>
            </a-form-item>
            <!-- 排序 -->
            <a-form-item
                    label="排序"
                    :label-col="{ span: 5 }"
                    :wrapper-col="{ span: 12 }"
            >
                <a-input
                        v-decorator="[
            'sort',
            {
              initialValue: datas.sort,
              rules: [
                {
                  pattern: new RegExp(/^[0-9]*$/),
                  message: '只能输入数字!'
                }
              ]
            }
          ]"
                ></a-input>
            </a-form-item>
        </a-form>
        <a-button key="submit" type="primary" :loading="loading" @click="handleOk">
            编辑
        </a-button>
        <!-- 第二个表单 -->
        <a-form :form="form1">
            <!-- 原价 -->
            <a-form-item
                    label="原价"
                    :label-col="{ span: 5 }"
                    :wrapper-col="{ span: 12 }"
            >
                <a-input
                        placeholder="请输入原价"
                        v-decorator="[
            'original_price',
            {
              rules: [
                {
                  required: true,
                  message: '原价不能为空！'
                },
                {
                  pattern: new RegExp(
                    /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/
                  ),
                  message: '请输入正确的金额!'
                }
              ]
            }
          ]"
                />
            </a-form-item>
            <!-- 售价 -->
            <a-form-item
                    label="售价"
                    :label-col="{ span: 5 }"
                    :wrapper-col="{ span: 12 }"
            >
                <a-input
                        placeholder="请输入售价"
                        v-decorator="[
            'price',
            {
              rules: [
                {
                  required: true,
                  message: '原价不能为空！'
                },
                {
                  pattern: new RegExp(
                    /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/
                  ),
                  message: '请输入正确的金额!'
                }
              ]
            }
          ]"
                />
            </a-form-item>
            <!-- 属性-->
            <a-form-item
                    v-for="(item, index) in attrList"
                    :key="index"
                    :label="item"
                    :label-col="{ span: 5 }"
                    :wrapper-col="{ span: 12 }"
            >
                <a-input
                        :placeholder="`请输入${item}`"
                        v-decorator="[
            `${index}`,
            {
              rules: [{ required: true, message: '属性不能为空！' }]
            }
          ]"
                />
            </a-form-item>
            <!-- 库存 -->
            <a-form-item
                    label="库存"
                    :label-col="{ span: 5 }"
                    :wrapper-col="{ span: 12 }"
            >
                <a-input
                        placeholder="请输入库存"
                        v-decorator="[
            'quantity',
            {
              rules: [
                { required: true, message: '库存不能为空！' },
                {
                  pattern: new RegExp(/^[0-9]*$/),
                  message: '只能输入数字!'
                }
              ]
            }
          ]"
                />
            </a-form-item>
            <!-- 排序 -->
            <a-form-item
                    label="排序"
                    :label-col="{ span: 5 }"
                    :wrapper-col="{ span: 12 }"
            >
                <a-input
                        v-decorator="[
            'skusort',
            {
              rules: [
                {
                  pattern: new RegExp(/^[0-9]*$/),
                  message: '只能输入数字!'
                }
              ]
            }
          ]"
                ></a-input>
            </a-form-item>
            <a-button key="submit" type="primary" :loading="loading1" @click="create">
                新增库存
            </a-button>
        </a-form>
    </a-layout-content>
</template>
<script>
    import moment from "moment";
    // import { message } from "ant-design-vue";
    import {stringify} from "querystring";
    import {message} from "ant-design-vue";
    import ip from "../../../api.js";

    // const columns = [];
    const data = [];
    export default {
        data() {
            return {
                datas: {},
                columns: [],
                attrs: [],
                loading: false,
                loading1: false,
                type: "",
                targetList: [],
                attrList: [],
                createTime: "",
                sku: [],
                data,
                skuList: [],
                tagList: [],
                tag: [],
                type1: "",
                type2: "",
                type3: "",
                catelist: [],
                prodlist: [],
                target_obj: [],
                formLayout: "horizontal",
                form: this.$form.createForm(this, {name: "coordinated"}),
                form1: this.$form.createForm(this, {name: "coordinated"})
            };
        },
        methods: {
            moment,
            //处理商品分类改变对应属性的变化
            handleCateChange(key) {
                console.log(key);
                for (let i in this.catelist) {
                    if (this.catelist[i].id == key) {
                        this.attrList = Object.values(JSON.parse(this.catelist[i].property));
                    }
                }
                console.log("this.attrList" + this.attrList);
                for (let i in this.attrList) {
                    if (this.columns[i].dataIndex == "attr1") {
                        console.log("del attr1");
                        this.columns.splice(0, 1);
                    }
                    if (this.columns[i].dataIndex == "attr2") {
                        console.log("del attr2");
                        this.columns.splice(0, 1);
                    }
                    if (this.columns[i].dataIndex == "attr3") {
                        console.log("del attr3");
                        this.columns.splice(0, 1);
                    }
                }
                console.log(this.columns);
                for (let i = this.attrList.length; i > 0; i--) {
                    console.log(i);
                    console.log(this.attrList[i]);
                    this.columns.unshift({
                        title: this.attrList[i - 1],
                        dataIndex: "attr" + i,
                        key: "attr" + i,
                        width: "15%",
                        scopedSlots: {customRender: "attr" + i}
                    });
                    this.attrs.unshift(i);
                }
                console.log(this.columns);
                console.log(this.data);
            },
            //获取商品时间
            onChange(date, dateString) {
                console.log(date, dateString);
                this.createTime = dateString;
            },

            //新增库存
            create() {
                this.form1.validateFields().then(data => {
                    data.sort = data.skusort;
                    data.product_id = this.datas.id;
                    console.log(data);
                    this.axios
                        .post(ip.ip + "/sku/create", stringify(data))
                        .then(data => {
                            console.log(data);
                        })
                        .catch(error => {
                            return error;
                        });
                    this.form1.resetFields();
                });
            },
            //编辑商品
            handleOk() {
                // this.loading = true;
                let config = {
                    headers: {
                        "Authorization": localStorage.getItem("token")
                    }
                };
                this.form.validateFields().then(data => {
                    console.log(data);
                    console.log(data.type1);
                    console.log(data.type2);
                    console.log(data.type3);
                    for (let i in this.tagList) {
                        console.log(123);
                        console.log(this.tagList[i]);
                        if (this.tagList[i].type == "1") {
                            this.tag.push({
                                id: this.tagList[i].id,
                                type: 1,
                                value: data.type1
                            });
                        }
                        if (this.tagList[i].type == "2") {
                            this.tag.push({
                                id: this.tagList[i].id,
                                type: 2,
                                value: this.createTime
                            });
                        }
                        if (this.tagList[i].type == "3") {
                            this.tag.push({
                                id: this.tagList[i].id,
                                type: 3,
                                value: data.type3
                            });
                        }
                    }
                    for (let i in this.sku) {
                        delete this.sku[i].key;
                    }
                    console.log(this.sku);
                    data.sku = this.sku;
                    data.tag = this.tag;
                    delete data.type1;
                    delete data.type2;
                    delete data.type3;
                    console.log(this.tag);
                    console.log(JSON.stringify(data));
                    this.axios
                        .post(
                            ip.ip + "/product/update?id=" + this.datas.id,
                            JSON.stringify(data), config
                        )
                        .then(data => {
                            console.log(data);
                            message.info("编辑成功");
                            this.$router.push("/admin/product/index");
                        })
                        .catch(error => {
                            console.log(error);
                            message.info("编辑失败");
                            return error;
                        });
                });
            },
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
                if (target) {
                    target.editable = true;
                    this.data = newData;
                }
            },
            save(key) {
                const newData = [...this.data];
                const target = newData.filter(item => key === item.key)[0];
                if (target) {
                    delete target.editable;
                    this.data = newData;
                    this.cacheData = newData.map(item => ({...item}));
                }
                this.sku.push(target);
                console.log(target);
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
            }
        },
        created() {
            let config = {
                headers: {
                    "Authorization": localStorage.getItem("token")
                }
            };
            this.columns = [];
            this.datas = this.$route.query.data;
            console.log(this.datas);
            console.log(this.datas.category_id);
            //获取分类列表
            this.axios
                .get(ip.ip + "/category", config)
                .then(data => {
                    for (let i in data.data) {
                        this.catelist.push(data.data[i]);
                        if (data.data[i].id == this.datas.category_id) {
                            this.attrList = data.data[i].property;
                        }
                    }
                    this.attrList = JSON.parse(this.attrList);
                    for (let i in this.attrList) {
                        this.columns.push({
                            title: this.attrList[i],
                            dataIndex: i,
                            key: i,
                            width: "15%",
                            scopedSlots: {customRender: i}
                        });
                        this.attrs.push(i);
                    }

                    console.log(this.attrs);
                    console.log(this.attrList);
                    this.columns.push({
                        title: "原价",
                        dataIndex: "original_price",
                        key: "original_price",
                        width: "20%",
                        scopedSlots: {customRender: "original_price"}
                    });
                    this.columns.push({
                        title: "售价",
                        dataIndex: "price",
                        key: "price",
                        width: "20%",
                        scopedSlots: {customRender: "price"}
                    });
                    this.columns.push({
                        title: "库存",
                        dataIndex: "quantity",
                        key: "quantity",
                        width: "15%",
                        scopedSlots: {customRender: "quantity"}
                    });
                    this.columns.push({
                        title: "操作",
                        dataIndex: "operation",
                        scopedSlots: {customRender: "operation"}
                    });
                    console.log(this.attrList);
                    console.log(this.catelist);
                    console.log(this.columns);
                })
                .catch(error => {
                    return error;
                });
            this.axios
                .get(ip.ip + "/sku?product_id=" + this.datas.id, config)
                .then(data => {
                    console.log(data.data);
                    for (let i in data.data) {
                        data.data[i].key = data.data[i].id;
                    }
                    this.data = data.data;
                    console.log(this.data);
                })
                .catch(error => {
                    return error;
                });
            //获取标签
            this.axios
                .get(ip.ip + "/tag?product_id=" + this.datas.id,config)
                .then(data => {
                    console.log(data.data);
                    for (let i in data.data) {
                        if (data.data[i].type == 1) {
                            this.type1 = data.data[i].value;
                        }
                        if (data.data[i].type == 2) {
                            this.type2 = String(data.data[i].value);
                        }
                        if (data.data[i].type == 3) {
                            this.type3 = data.data[i].value;
                        }
                    }
                    console.log(this.type2);
                    this.tagList = data.data;
                })
                .catch(error => {
                    return error;
                });
        }
    };
</script>
<style scoped>
    .image {
        width: 100px;
    }
</style>
