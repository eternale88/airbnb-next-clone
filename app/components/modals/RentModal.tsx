"use client";

import { useMemo, useState } from "react";
import Modal from "./Modal";
import useRentModal from "@/app/hooks/useRentModal";
import Heading from "../Heading";
import { categories } from "../navbar/Categories";
import CategoryInput from "../inputs/CategoryInput";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import CountrySelect from "../inputs/CountrySelect";
import dynamic from "next/dynamic";
import Counter from "../inputs/Counter";
import ImageUpload from "../inputs/ImageUpload";
import Input from "../inputs/Input";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
//Must dynamically import map component so it will render map locations correctly, leaflet is hacky since it's not made to work with React
//import Map from "../Map";

// STEPS for rent modal form
enum STEPS {
  CATEGORY = 0,
  LOCATION = 1,
  INFO = 2,
  IMAGES = 3,
  DESCRIPTION = 4,
  PRICE = 5,
}

const RentModal = () => {
  const router = useRouter();
  const rentModal = useRentModal();

  const [step, setStep] = useState(STEPS.CATEGORY);
  const [isLoading, setIsloading] = useState(false);

  //initialize form
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm<FieldValues>({
    defaultValues: {
      category: "",
      location: null,
      guestCount: 1,
      roomCount: 1,
      bathroomCount: 1,
      imageSrc: "",
      price: 1,
      title: "",
      description: "",
    },
  });

  //can't just register the input as with register form, as this category input is a custom input (not really a proper HTML input), so we need a workaround, first we watch the input
  const category = watch("category");
  const location = watch("location");
  const guestCount = watch("guestCount");
  const roomCount = watch("roomCount");
  const bathroomCount = watch("bathroomCount");
  const imageSrc = watch("imageSrc");

  //dynamically import our leaflet map component, so it will render locations properly on map when user selects a country, it will re-render every time user selects a different country
  const Map = useMemo(
    () =>
      dynamic(() => import("../Map"), {
        ssr: false,
      }),
    [location]
  );
  //second, setValue wouldn't trigger re render of form, so we need to set a custom setter
  const setCustomValue = (id: string, value: any) => {
    setValue(id, value, {
      shouldDirty: true,
      shouldValidate: true,
      shouldTouch: true,
    });
  };

  const onBack = () => {
    setStep((value) => value - 1);
  };

  const onNext = () => {
    setStep((value) => value + 1);
  };

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    // if not on last step, and click next button, move to next step - the button is the same as the submit button, so this keeps it from submitting until it should be
    if (step !== STEPS.PRICE) {
      return onNext();
    }

    // If the on the last step(price) run this code below, post th form
    setIsloading(true);

    axios
      .post("/api/listings", data)
      .then(() => {
        toast.success("Listing Created!");
        //refresh page
        router.refresh();
        //reset form
        reset();
        //reset steps
        setStep(STEPS.CATEGORY);
        rentModal.onClose();
      })
      .catch(() => {
        toast.error("Something went wrong.");
      })
      .finally(() => {
        setIsloading(false);
      });
  };

  const actionLabel = useMemo(() => {
    //if on last step, show create to submit request,
    // otherwise show next to click to next step
    if (step === STEPS.PRICE) {
      return "Create";
    }

    return "Next";
  }, [step]);

  const secondaryActionLabel = useMemo(() => {
    // if on the first step, then there is no back button needed, otherwise we can show back button
    if (step === STEPS.CATEGORY) {
      return undefined;
    }

    return "Back";
  }, [step]);

  let bodyContent = (
    <div className='flex flex-col gap-8'>
      <Heading
        title='Which of these best describes your place?'
        subtitle='Pick a category'
      />
      <div className='grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[50vh] overflow-y-auto'>
        {categories.map((item) => (
          <div key={item.label} className='col-span-1'>
            <CategoryInput
              onClick={(category) => setCustomValue("category", category)}
              selected={category === item.label}
              label={item.label}
              icon={item.icon}
            />
          </div>
        ))}
      </div>
    </div>
  );
  //second step
  if (step === STEPS.LOCATION) {
    bodyContent = (
      <div className='flex flex-col gap-8'>
        <Heading
          title='Where is your place located?'
          subtitle='Help guests find you!'
        />
        {/*create hook for loading countries into select component */}
        <CountrySelect
          onChange={(value) => setCustomValue("location", value)}
          value={location}
        />
        <Map center={location?.latlng} />
      </div>
    );
  }

  //third step
  if (step === STEPS.INFO) {
    bodyContent = (
      <div className='flex flex-col gap-8'>
        <Heading
          title='Share some basics about your place'
          subtitle='What ammenities do you have?'
        />
        <Counter
          title='Guests'
          subtitle='How many guests do you allow?'
          value={guestCount}
          onChange={(value) => setCustomValue("guestCount", value)}
        />
        <hr />
        <Counter
          title='Rooms'
          subtitle='How many rooms do you have?'
          value={roomCount}
          onChange={(value) => setCustomValue("roomCount", value)}
        />
        <hr />
        <Counter
          title='Bathrooms'
          subtitle='How many bathrooms do you have?'
          value={bathroomCount}
          onChange={(value) => setCustomValue("bathroomCount", value)}
        />
      </div>
    );
  }

  // fourth step
  if (step === STEPS.IMAGES) {
    bodyContent = (
      <div className='flex flex-col gap-8'>
        <Heading
          title='Add a photo of your place'
          subtitle='Show guests what your place looks like'
        />
        <ImageUpload
          value={imageSrc}
          onChange={(value) => setCustomValue("imageSrc", value)}
        />
      </div>
    );
  }

  // fifth step
  if (step === STEPS.DESCRIPTION) {
    bodyContent = (
      <div className='flex flex-col gap-8'>
        <Heading
          title='How would you describe your place?'
          subtitle='Short and sweet works best!'
        />
        <Input
          id='title'
          label='Title'
          disabled={isLoading}
          register={register}
          errors={errors}
          required
        />
        <hr />
        <Input
          id='description'
          label='Description'
          disabled={isLoading}
          register={register}
          errors={errors}
          required
        />
      </div>
    );
  }

  // final step, sixth step
  if (step === STEPS.PRICE) {
    bodyContent = (
      <div className='flex flex-col gap-8'>
        <Heading
          title='Now, set your price'
          subtitle='How much do you charge per night?'
        />
        <Input
          id='price'
          label='Price'
          formatPrice
          type='number'
          disabled={isLoading}
          register={register}
          errors={errors}
          required
        />
      </div>
    );
  }

  return (
    <Modal
      isOpen={rentModal.isOpen}
      onClose={rentModal.onClose}
      onSubmit={handleSubmit(onSubmit)}
      actionLabel={actionLabel}
      secondaryActionLabel={secondaryActionLabel}
      secondaryAction={step === STEPS.CATEGORY ? undefined : onBack}
      title='Airbnb your home!'
      body={bodyContent}
    />
  );
};

export default RentModal;
