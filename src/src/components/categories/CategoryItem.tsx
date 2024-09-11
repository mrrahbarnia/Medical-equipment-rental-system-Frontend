"use client"
import axios from "axios";
import { RxUpdate } from "react-icons/rx";
import { MdOutlineDangerous } from "react-icons/md";
import { AiOutlineDelete } from "react-icons/ai";
import { Fragment, ChangeEvent, useState, useEffect } from "react";
import useDeleteCategory from "@/hooks/useDeleteCategory";
import { categoryType } from "@/hooks/useFetchCategories";
import { EXTERNAL_BASE_ENDPOINTS } from "@/configs/default";
import useUpdateCategory from "@/hooks/useUpdateCategory";
import { errorHandler } from "@/utils/messageUtils";

const INTERNAL_CATEGORY_DETAIL_API: string = "/apis/categories/"

const CategoryItem = ({category}: {category: categoryType}) => {
    const [isOpenDeleteModal, setIsOpenDeleteModal] = useState<boolean>(false);
    const [isOpenUpdateModal, setIsOpenUpdateModal] = useState<boolean>(false);
    const {categoryMutateAsync} = useDeleteCategory();
    const [categoryValue, setCategoryValue] = useState<string>("");
    const [parentCategoryValue, setParentCategoryValue] = useState<string>("");
    const [openCategoriesMenu, setOpenCategoriesMenu] = useState<boolean>(false);
    const [formLoading, setFormLoading] = useState<boolean>(false);
    const [categoriesResponse, setCategoriesResponse] = useState<string[]>([]);
    const [formError, setFormError] = useState<string>("");
    const [debouncedParentCategory, setDebouncedParentCategory] = useState<string>();
    const {mutateAsyncUpdateCategory} = useUpdateCategory();

    useEffect(() => {
        setFormLoading(true);
        const handler = setTimeout(() => {
            setDebouncedParentCategory(parentCategoryValue);
            setFormLoading(false);
        }, 500)
        return () => {
            clearTimeout(handler)
        }
    }, [parentCategoryValue])

    useEffect(() => {
        if (debouncedParentCategory) {
            const url = `${EXTERNAL_BASE_ENDPOINTS}/admin/search-categories/`
            const fetchCategories = async() => {
                try {
                    const result = await axios.get(url, {params: {category_name: debouncedParentCategory}})
                    setCategoriesResponse(result.data);
                } catch (error) {
                }
            };
            fetchCategories();
        }
    }, [debouncedParentCategory])

    const deleteCategoryHandler = (id: number) => {
        categoryMutateAsync(id).then(() => {setIsOpenDeleteModal(false)});
    }

    const updateCategoryHandler = (id: number) => {
        mutateAsyncUpdateCategory({
            id,
            name: categoryValue ,
            parentCategoryName: parentCategoryValue
        }).then(() => {
            setParentCategoryValue("");
            setOpenCategoriesMenu(false);
            setIsOpenUpdateModal(false);
        }).catch(error => {
            if (error.response && error.response.data && error.response.data?.detail === "There is no category with the provided parent category name!") {
                errorHandler("کتگوری والد باید یا خالی یا بین موارد پیشنهادی باشد.", setFormError)
            }
            if (error.response && error.response.data && error.response.data?.detail === "Category name field is unique!") {
                errorHandler("اسامی دسته بندی ها باید یکتا باشد.", setFormError)
            }
        })
    }

    const parentCategoryChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.value.length >= 2) {
            setOpenCategoriesMenu(true);
        } else {
            setOpenCategoriesMenu(false);
        }
        setParentCategoryValue(event.target.value);
    }

    const selectParentCategoryHandler = (parentCategory: string) => {
        setParentCategoryValue(parentCategory);
        setOpenCategoriesMenu(false);
    }

    const cancelModalHandler = () => {
        setOpenCategoriesMenu(false);
        setParentCategoryValue("");
        setIsOpenUpdateModal(false)
    }

    const openUpdateModal = async(name: string, parentCategoryName: string) => {
        setCategoryValue(name);
        setParentCategoryValue(parentCategoryName);
        setIsOpenUpdateModal(true);
    }

    const isFormValid = categoryValue.length >= 1;

    return (
        <Fragment>
            {isOpenDeleteModal && <div className="bg-gradient-to-b from-white to-gray-300 fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col z-50 rounded-lg items-center justify-center gap-7 h-56 w-80">
                <div className="flex items-center justify-center gap-1 p-3">
                    <p dir="rtl" className="font-[Yekan-Medium] overflow-hidden text-sm w-48">آیا قصد پاک کردن آگهی با عنوان <span className="font-[Yekan-Black] text-red-600">{category.name}</span> را دارید؟</p>
                    <MdOutlineDangerous size={25} className="text-red-600" /> 
                </div>
                <div className="flex items-center gap-2">
                    <button className="font-[Yekan-Medium] bg-green-50 text-green-600 px-6 py-1 rounded-md hover:bg-green-200 active:bg-green-200" onClick={() => setIsOpenDeleteModal(false)}>خیر</button>
                    <button className="font-[Yekan-Black] bg-red-50 text-red-500 px-6 py-1 rounded-md hover:bg-red-200 active:bg-red-200" onClick={() => deleteCategoryHandler(category.id)}>بله</button>
                </div>
            </div>}
            {isOpenUpdateModal && <div className="bg-gradient-to-b from-white to-gray-300 fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col z-50 rounded-lg py-10 items-center justify-center gap-7 w-80">
                <form className="flex flex-col gap-2 w-full px-4">
                    <div className="flex flex-col items-end gap-1">
                        <label htmlFor="categoryName" className="font-[Yekan-Medium]">نام دسته بندی</label>
                        <input id="categoryName" name="name" type="text" className="border-2 outline-1 py-2 px-3 w-full rounded-md font-[Yekan-Medium]" dir="rtl" onChange={(event) => setCategoryValue(event.target.value)} value={categoryValue}/>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                        <label htmlFor="parentCategoryName" className="font-[Yekan-Medium]">نام دسته بندی والد</label>
                        <input id="parentCategoryName" name="parentCategoryName" type="text" className="border-2 outline-1 py-2 px-3 w-full rounded-md font-[Yekan-Medium]" dir="rtl" onChange={parentCategoryChangeHandler} value={parentCategoryValue} />
                        {openCategoriesMenu && <ul className="bg-gray-300 w-full rounded-md flex flex-col gap-2 px-2 py-2">
                        {formLoading ? <p className="rounded-full border-8 w-7 h-7 border-slate-600 border-solid border-t-transparent animate-spin m-auto"></p> : 
                        categoriesResponse.length === 0 ? <p className="font-[Yekan-Medium] text-right">دسته بندی یافت نشد</p> : categoriesResponse.map((category) => <li onClick={() => selectParentCategoryHandler(category)} className="text-right cursor-pointer overflow-hidden hover:bg-gray-100 font-[Yekan-Medium] rounded-md px-2 py-1" key={category}>{category}</li>)}
                    </ul>}
                    </div>
                </form>
                <div className="flex items-center gap-2">
                    <button type="button" onClick={cancelModalHandler} className="font-[Yekan-Medium] bg-red-50 text-red-600 px-6 py-1 rounded-md hover:bg-red-200 active:bg-red-200">انصراف</button>
                    <button onClick={() => updateCategoryHandler(category.id)} disabled={!isFormValid} type="button" className="disabled:pointer-events-none disabled:text-gray-400 font-[Yekan-Medium] bg-yellow-50 text-yellow-600 px-6 py-1 rounded-md hover:bg-yellow-200 active:bg-yellow-200">بروزرسانی</button>
                </div>
                {formError && <p dir="rtl" className="bg-red-600 leading-6 font-[Yekan-Medium] text-right p-3 rounded-md text-white text-xs">{formError}</p>}
            </div>}
            <div className="relative shadow-md h-auto gap-1 flex items-center p-2 rounded-md justify-end whitespace-normal break-words overflow-hidden">
                <button type="button" onClick={() => setIsOpenDeleteModal(true)} className="flex flex-col gap-3 z-20 absolute top-2 left-2 bg-red-50 hover:bg-red-200 active:bg-red-200 transition-colors p-2 rounded-md text-red-500 ">
                    <AiOutlineDelete size={25} />
                </button>
                <button type="button" onClick={() => openUpdateModal(category.name, category.parentName)} className="flex flex-col gap-3 z-20 absolute bottom-2 left-2 bg-yellow-50 hover:bg-yellow-200 active:bg-yellow-200 transition-colors p-2 rounded-md text-yellow-600">
                    <RxUpdate size={25} />
                </button>
                <div className="flex flex-col gap-2 h-28 w-full items-end">
                    <p className="font-[Yekan-Medium] text-base " dir="rtl">دسته بندی:{category.name}</p>
                    <hr className="border-1 border-gray-300 w-2/3"/>
                    <span className={`text-white font-[Yekan-Medium] text-sm w-fit py-1 px-2 rounded-md text-right ${category.parentName ? "bg-green-600" : "bg-red-600"}`} dir="rtl">{category.parentName ? `دسته بندی والد:${category.parentName}` : "دسته بندی والد ندارد."}</span>
                </div>
            </div>
            {isOpenDeleteModal || isOpenUpdateModal ? <div className="fixed left-0 top-0 z-40 bg-black h-full w-full opacity-85"></div> : undefined}
        </Fragment>
    )
};

export default CategoryItem;