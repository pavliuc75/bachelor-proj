import { PatchProductRequest, Product, ProductRequest } from "../../generated-sources/openapi";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import CInput from "../common/CInput";
import { validatorHelper } from "../../utils/validatorHelper";
import CTextarea from "../common/CTextarea";
import { RootState } from "../../store";
import { fetchCategories } from "../../store/productSlice";
import {
  createProduct,
  fetchProducts,
  updateProduct,
  uploadProductImage,
} from "../../store/businessManagementToolSlice";
import { showSnackbar } from "../../store/eventSlice";
import { stringFormatterHelper } from "../../utils/stringFormatterHelper";
import CMenu from "../common/CMenu";
import CButtonPrimary from "../common/CButtonPrimary";
import CInfo from "../common/CInfo";
import CFileInput from "../common/CFileInput";
import CButtonSecondary from "../common/CButtonSecondary";

interface Props {
  onClose: () => void;
  className?: string;
  product?: Product;
}

function EditProduct(props: Props) {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const { onClose, className = "", product } = props;

  const { categories } = useSelector((state: RootState) => state.product);

  const cInputNameRef = useRef<any>(null);
  const cTextareaDescriptionRef = useRef<any>(null);
  const cFileInputMainImageRef = useRef<any>(null);
  const cFileInputImage1Ref = useRef<any>(null);
  const cFileInputImage2Ref = useRef<any>(null);
  const cFileInputImage3Ref = useRef<any>(null);
  const cFileInputImage4Ref = useRef<any>(null);
  const cFileInputImage5Ref = useRef<any>(null);
  const cInputPriceRef = useRef<any>(null);
  const cInputAmountInStockRef = useRef<any>(null);

  const [name, setName] = useState<any>("");
  const [description, setDescription] = useState<any>("");
  const [categoryId, setCategoryId] = useState<any>(null);
  const [price, setPrice] = useState<any>(null);
  const [amountInStock, setAmountInStock] = useState("");
  const [mainImageKey, setMainImageKey] = useState<any>("");
  const [mainImageUrl, setMainImageUrl] = useState<any>("");
  const [image1Key, setImage1Key] = useState<any>("");
  const [image1Url, setImage1Url] = useState<any>("");
  const [image2Key, setImage2Key] = useState<any>("");
  const [image2Url, setImage2Url] = useState<any>("");
  const [image3Key, setImage3Key] = useState<any>("");
  const [image3Url, setImage3Url] = useState<any>("");
  const [image4Key, setImage4Key] = useState<any>("");
  const [image4Url, setImage4Url] = useState<any>("");
  const [image5Key, setImage5Key] = useState<any>("");
  const [image5Url, setImage5Url] = useState<any>("");

  const categorySelectorItems = categories.map((category) => {
    return {
      text: t(category.category || "") || "",
      label: category.id === categoryId,
      function: () => setCategoryId(category.id),
    };
  });

  const selectedCategoryName = categories.find((category) => category.id === categoryId)?.category || "...";

  useEffect(() => {
    if (!categories.length) {
      // @ts-ignore
      dispatch(fetchCategories(true))
        .then(() => {
          if (!product) setCategoryId(categories[0].id);
        })
        .catch(() => onClose());
    } else {
      if (!product) setCategoryId(categories[0].id);
    }

    if (product) {
      setName(product.name);
      setPrice(product.price + "");
      setCategoryId(product.categoryId);
      setDescription(product.description);
      setAmountInStock(product.stockAmount + "");
      setMainImageKey(product.mainImage?.imageKey);
      setMainImageUrl(product.mainImage?.imageUrl);

      setImage1Key(product.additionalImages?.at(0)?.imageKey);
      setImage1Url(product.additionalImages?.at(0)?.imageUrl);
      setImage2Key(product.additionalImages?.at(1)?.imageKey);
      setImage2Url(product.additionalImages?.at(1)?.imageUrl);
      setImage3Key(product.additionalImages?.at(2)?.imageKey);
      setImage3Url(product.additionalImages?.at(2)?.imageUrl);
      setImage4Key(product.additionalImages?.at(3)?.imageKey);
      setImage4Url(product.additionalImages?.at(3)?.imageUrl);
      setImage5Key(product.additionalImages?.at(4)?.imageKey);
      setImage5Url(product.additionalImages?.at(4)?.imageUrl);
    }
  }, []);

  function handleMainImageSelected(file: File) {
    // @ts-ignore
    dispatch(uploadProductImage(file))
      .then((response: any) => {
        setMainImageKey(response.data.imageKey);
        setMainImageUrl(response.data.imageUrl);
      })
      .catch(() => {
        dispatch(
          showSnackbar({
            message: t("somethingWentWrong"),
            type: "error",
          })
        );
        cFileInputMainImageRef.current.reset();
        cFileInputMainImageRef.current.validateInput();
      });
  }

  function handleSecondaryImageSelected(file: File, imageNumber: number) {
    // @ts-ignore
    dispatch(uploadProductImage(file))
      .then((response: any) => {
        if (imageNumber === 1) {
          setImage1Key(response.data.imageKey);
          setImage1Url(response.data.imageUrl);
        } else if (imageNumber === 2) {
          setImage2Key(response.data.imageKey);
          setImage2Url(response.data.imageUrl);
        } else if (imageNumber === 3) {
          setImage3Key(response.data.imageKey);
          setImage3Url(response.data.imageUrl);
        } else if (imageNumber === 4) {
          setImage4Key(response.data.imageKey);
          setImage4Url(response.data.imageUrl);
        } else if (imageNumber === 5) {
          setImage5Key(response.data.imageKey);
          setImage5Url(response.data.imageUrl);
        }
      })
      .catch(() => {
        dispatch(
          showSnackbar({
            message: t("somethingWentWrong"),
            type: "error",
          })
        );
        if (imageNumber === 1) {
          cFileInputImage1Ref.current.reset();
        } else if (imageNumber === 2) {
          cFileInputImage2Ref.current.reset();
        } else if (imageNumber === 3) {
          cFileInputImage3Ref.current.reset();
        } else if (imageNumber === 4) {
          cFileInputImage4Ref.current.reset();
        } else if (imageNumber === 5) {
          cFileInputImage5Ref.current.reset();
        }
      });
  }

  function validateMainImage(): boolean {
    if (mainImageKey && mainImageUrl) {
      return true;
    } else {
      cFileInputMainImageRef.current.reset();
      return cFileInputMainImageRef.current.validateInput();
    }
  }

  function handleSaveProduct(e?: any) {
    e?.preventDefault();

    let isNameValid = cInputNameRef.current.validateInput();
    let isDescriptionValid = cTextareaDescriptionRef.current.validateInput();
    let isPriceValid = cInputPriceRef.current.validateInput();
    let isAmountInStockValid = cInputAmountInStockRef.current.validateInput();
    let isMainImageValid = validateMainImage();

    if (isNameValid && isDescriptionValid && isPriceValid && isAmountInStockValid && isMainImageValid) {
      let additionalImages = [];

      if (image1Key && image1Url) {
        additionalImages.push({ imageKey: image1Key, imageUrl: image1Url });
      }
      if (image2Key && image2Url) {
        additionalImages.push({ imageKey: image2Key, imageUrl: image2Url });
      }
      if (image3Key && image3Url) {
        additionalImages.push({ imageKey: image3Key, imageUrl: image3Url });
      }
      if (image4Key && image4Url) {
        additionalImages.push({ imageKey: image4Key, imageUrl: image4Url });
      }
      if (image5Key && image5Url) {
        additionalImages.push({ imageKey: image5Key, imageUrl: image5Url });
      }

      if (product) {
        let patchProductRequest: PatchProductRequest = {
          id: product.id + "",
          name: name,
          price: parseFloat(stringFormatterHelper.replaceCommasWithDots(price)),
          categoryId: categoryId,
          description: description,
          stockAmount: parseInt(amountInStock),
          mainImage: {
            imageKey: mainImageKey,
            imageUrl: mainImageUrl,
          },
          additionalImages: additionalImages,
        };

        // @ts-ignore
        dispatch(updateProduct(patchProductRequest))
          .then(() => {
            onClose();
            // @ts-ignore
            dispatch(fetchProducts(1));
          })
          .catch(() =>
            dispatch(
              showSnackbar({
                message: t("somethingWentWrong"),
                type: "error",
              })
            )
          );
      } else {
        let productRequest: ProductRequest = {
          name: name,
          price: parseFloat(stringFormatterHelper.replaceCommasWithDots(price)),
          categoryId: categoryId,
          description: description,
          stockAmount: parseInt(amountInStock),
          mainImage: {
            imageKey: mainImageKey,
            imageUrl: mainImageUrl,
          },
          additionalImages: additionalImages,
        };

        // @ts-ignore
        dispatch(createProduct(productRequest))
          .then(() => {
            onClose();
            // @ts-ignore
            dispatch(fetchProducts(1));
          })
          .catch(() =>
            dispatch(
              showSnackbar({
                message: t("somethingWentWrong"),
                type: "error",
              })
            )
          );
      }
    }
  }

  return (
    <form className={className + " flex flex-col"} onSubmit={handleSaveProduct}>
      <CInput
        ref={cInputNameRef}
        value={name || ""}
        onUpdate={setName}
        inputSize={"medium"}
        labelText={t("name") + " *"}
        validatorFunctions={[validatorHelper.validateRequired]}></CInput>
      <CTextarea
        ref={cTextareaDescriptionRef}
        value={description || ""}
        onUpdate={setDescription}
        labelText={t("description") + " *"}
        validatorFunctions={[validatorHelper.validateRequired]}
        className={"mt-8"}></CTextarea>
      <span className="block c-text-14 mt-8 mb-2">{t("category") + " *"}</span>
      <div className="inline-block">
        <CMenu isRadio={true} items={categorySelectorItems}>
          <CButtonPrimary iconEnd={["fas", "chevron-down"]} type="button" text={selectedCategoryName}></CButtonPrimary>
        </CMenu>
      </div>
      <p className={"max-w-sm mt-2"}>{t("ifYouCannotTheCategoryThatFitsTheProductYouCan")}</p>
      <CInfo className={"mt-10"} text={t("theFilesBelowHaveToBeInPngCommaJpgOrJpegFormat") || ""}></CInfo>
      <CFileInput
        nonNativeFileName={mainImageKey ? t("someImageUploaded") || "" : ""}
        accept="image/png, image/jpeg, image/jpg"
        className={"mt-8"}
        labelText={t("mainImage") + " *"}
        ref={cFileInputMainImageRef}
        onFileSelected={handleMainImageSelected}
        descriptionText={t("mainImageDescription") || ""}></CFileInput>
      <CFileInput
        nonNativeFileName={image1Key ? t("someImageUploaded") || "" : ""}
        accept="image/png, image/jpeg, image/jpg"
        className={"mt-8"}
        labelText={t("image") + " 1"}
        ref={cFileInputImage1Ref}
        onFileSelected={(file) => handleSecondaryImageSelected(file, 1)}
        descriptionText={t("firstSecondaryImageDescription") || ""}></CFileInput>
      <CFileInput
        nonNativeFileName={image2Key ? t("someImageUploaded") || "" : ""}
        accept="image/png, image/jpeg, image/jpg"
        className={"mt-8"}
        labelText={t("image") + " 2"}
        ref={cFileInputImage2Ref}
        onFileSelected={(file) => handleSecondaryImageSelected(file, 2)}></CFileInput>
      <CFileInput
        nonNativeFileName={image3Key ? t("someImageUploaded") || "" : ""}
        accept="image/png, image/jpeg, image/jpg"
        className={"mt-8"}
        labelText={t("image") + " 3"}
        ref={cFileInputImage3Ref}
        onFileSelected={(file) => handleSecondaryImageSelected(file, 3)}></CFileInput>
      <CFileInput
        nonNativeFileName={image4Key ? t("someImageUploaded") || "" : ""}
        accept="image/png, image/jpeg, image/jpg"
        className={"mt-8"}
        labelText={t("image") + " 4"}
        ref={cFileInputImage4Ref}
        onFileSelected={(file) => handleSecondaryImageSelected(file, 4)}></CFileInput>
      <CFileInput
        nonNativeFileName={image5Key ? t("someImageUploaded") || "" : ""}
        accept="image/png, image/jpeg, image/jpg"
        className={"mt-8"}
        labelText={t("image") + " 5"}
        ref={cFileInputImage5Ref}
        onFileSelected={(file) => handleSecondaryImageSelected(file, 5)}></CFileInput>
      <CInput
        className={"mt-8"}
        ref={cInputPriceRef}
        value={price || ""}
        onUpdate={setPrice}
        inputSize={"medium"}
        labelText={t("pricePerUnit") + " (MDL) *"}
        validatorFunctions={[
          validatorHelper.validateRequired,
          validatorHelper.validateIsFloat,
          validatorHelper.validateIsPositive,
        ]}></CInput>
      <CInput
        className={"mt-8"}
        ref={cInputAmountInStockRef}
        value={amountInStock || ""}
        onUpdate={setAmountInStock}
        inputSize={"medium"}
        labelText={t("itemsInStock") + " *"}
        validatorFunctions={[
          validatorHelper.validateRequired,
          validatorHelper.validateIsInteger,
          validatorHelper.validateIsPositive,
        ]}></CInput>
      <div className="mt-8 flex items-center justify-end gap-x-6">
        <CButtonSecondary type="button" onClick={onClose} text={t("cancel")}></CButtonSecondary>
        <CButtonPrimary type="button" onClick={handleSaveProduct} text={t("confirm")}></CButtonPrimary>
      </div>
    </form>
  );
}

export default EditProduct;
