"use client"
import axios from "axios";
import { CgAdd } from "react-icons/cg";
import useFetchCategories from "@/hooks/useFetchCategories";
import CategoriesList from "./CategoriesList";
import { useAuth } from "@/contexts/authProvider";
import { useState, Fragment, useEffect, ChangeEvent } from "react";
import { EXTERNAL_BASE_ENDPOINTS } from "@/configs/default";
import useAddCategory from "@/hooks/useAddCategory";
import { errorHandler } from "@/utils/messageUtils";


const CategoriesContainer = () => {
    const auth = useAuth();
    const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
    const [categoryValue, setCategoryValue] = useState<string>("");
    const [debouncedParentCategory, setDebouncedParentCategory] = useState<string>();
    const [openCategoriesMenu, setOpenCategoriesMenu] = useState<boolean>(false);
    const [categoriesResponse, setCategoriesResponse] = useState<string[]>([]);
    const [parentCategoryValue, setParentCategoryValue] = useState<string>("");
    const [formLoading, setFormLoading] = useState<boolean>(false);
    const {createCategoryAsyncMutate} = useAddCategory();
    const [formError, setFormError] = useState<string>("");
    const {
        categoriesCount,
        categoriesData,
        categoriesError,
        categoriesPending
    } = useFetchCategories();

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

    const saveCategoryHandler = () => {
        createCategoryAsyncMutate(
            {name: categoryValue, parentCategoryName: parentCategoryValue}
        ).then(() => {
            setParentCategoryValue("");
            setOpenCategoriesMenu(false);
            setIsOpenModal(false);
        }).catch(error => {
            if (error.response && error.response.data && error.response.data?.detail === "There is no category with the provided parent category name!") {
                errorHandler("کتگوری والد باید یا خالی یا بین موارد پیشنهادی باشد.", setFormError)
            }
            if (error.response && error.response.data && error.response.data?.detail === "Category name field is unique!") {
                errorHandler("اسامی دسته بندی ها باید یکتا باشد.", setFormError)
            }
            
        })
    }

    const cancelModalHandler = () => {
        setOpenCategoriesMenu(false);
        setParentCategoryValue("");
        setIsOpenModal(false)
    }

    const isFormValid = categoryValue.length >= 1;

    if (categoriesError) {
        auth.logout();
        return <div className="h-screen flex items-center justify-center">
                <p dir="rtl" className="bg-red-600 py-2 text-white px-3 rounded-lg font-[Yekan-Bold]">برای دسترسی به این صفحه ابتدا باید وارد حساب کاربری خود شوید.</p>
            </div>
    }
    return (
        <Fragment>
            {isOpenModal && <div className="bg-gradient-to-b from-white to-gray-300 fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col z-50 rounded-lg py-10 items-center justify-center gap-7 w-80">
                <form className="flex flex-col gap-2 w-full px-4">
                    <div className="flex flex-col items-end gap-1">
                        <label htmlFor="categoryName" className="font-[Yekan-Medium]">نام دسته بندی</label>
                        <input id="categoryName" name="name" type="text" className="border-2 outline-1 py-2 px-3 w-full rounded-md font-[Yekan-Medium]" dir="rtl" onChange={(event) => setCategoryValue(event.target.value)} />
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
                    <button onClick={saveCategoryHandler} disabled={!isFormValid} type="button" className="disabled:pointer-events-none disabled:text-gray-400 font-[Yekan-Medium] bg-green-50 text-green-500 px-6 py-1 rounded-md hover:bg-green-200 active:bg-green-200">ذخیره</button>
                </div>
                {formError && <p dir="rtl" className="bg-red-600 leading-6 font-[Yekan-Medium] text-right p-3 rounded-md text-white text-xs">{formError}</p>}
            </div>}
            <div className="pt-40 w-11/12 mx-auto min-h-screen">
                <div className="flex font-[Yekan-Medium] items-center justify-between mb-14">
                    <span>تعداد دسته بندی ها:{categoriesCount}</span>
                    <div className="flex items-center gap-1 bg-green-100 hover:bg-green-200 active:bg-green-200 transition-colors text-green-800 px-2 py-1 rounded-md cursor-pointer" onClick={() => setIsOpenModal(true)}>
                        <p>افزودن</p>
                        <CgAdd size={20} />
                    </div>
                    
                </div>
                {categoriesPending ? <p className="rounded-full border-8 w-10 h-10 border-slate-600 border-solid border-t-transparent animate-spin m-auto"></p>
            : categoriesData ? <CategoriesList categoriesCount={categoriesCount} categoriesList={categoriesData}/> : undefined}
            </div>
            {isOpenModal && <div className="fixed left-0 top-0 z-40 bg-black h-full w-full opacity-85"></div>}
        </Fragment>
    )

};

export default CategoriesContainer;