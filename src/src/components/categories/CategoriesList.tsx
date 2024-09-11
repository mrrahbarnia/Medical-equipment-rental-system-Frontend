"use client"
import CategoryItem from "./CategoryItem";
import { categoryType } from "@/hooks/useFetchCategories";

const CategoriesList = ({categoriesList, categoriesCount}: {categoriesList: categoryType[], categoriesCount: number}) => {
    return (
        <div className="mx-auto flex flex-col gap-3 w-full min-[500px]:w-[460px]">
            {categoriesList.map(category => <CategoryItem key={category.id} category={category} />)}
        </div>
    )
};

export default CategoriesList;