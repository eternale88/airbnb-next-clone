"use client";

import { Range } from "react-date-range";
import qs from "query-string";
import { useCallback, useMemo, useState } from "react";

import { FieldValues, SubmitHandler, useForm } from "react-hook-form";

import Modal from "./Modal";
import Heading from "../Heading";
import Input from "../inputs/Input";
import toast from "react-hot-toast";
import Button from "../Button";
import { useRouter, useSearchParams } from "next/navigation";
import useSearchModal from "@/app/hooks/useSearchModal";
import dynamic from "next/dynamic";
import CountrySelect, { CountrySelectValue } from "../inputs/CountrySelect";
import { formatISO } from "date-fns";
import Calendar from "../inputs/Calendar";
import Counter from "../inputs/Counter";

enum STEPS {
  LOCATION = 0,
  DATE = 1,
  INFO = 2,
}

const SearchModal = () => {
  const router = useRouter();
  const searchModal = useSearchModal();
  const params = useSearchParams();

  const [step, setStep] = useState(STEPS.LOCATION);
  const [location, setLocation] = useState<CountrySelectValue>();
  const [guestCount, setGuestCount] = useState(1);
  const [roomCount, setRoomCount] = useState(1);
  const [bathroomCount, setBathroomCount] = useState(1);
  const [dateRange, setDateRange] = useState<Range>({
    startDate: new Date(),
    endDate: new Date(),
    key: "selection",
  });

  const [isLoading, setIsLoading] = useState(false);

  //dynamically import our leaflet map component, so it will render locations properly on map when user selects a country, it will re-render every time user selects a different country
  const Map = useMemo(
    () =>
      dynamic(() => import("../Map"), {
        ssr: false,
      }),
    [location]
  );

  const onBack = useCallback(() => {
    setStep((value) => value - 1);
  }, []);

  const onNext = useCallback(() => {
    setStep((value) => value + 1);
  }, []);

  const onSubmit = useCallback(async () => {
    if (step !== STEPS.INFO) {
      return onNext();
    }

    let currentQuery = {};

    if (params) {
      //parse query string into object
      currentQuery = qs.parse(params.toString());
    }

    // initial updated query
    const updatedQuery: any = {
      ...currentQuery,
      locationValue: location?.value,
      guestCount,
      roomCount,
      bathroomCount,
    };

    //if there are dates

    //must format dates to strings as they have to go in our url to update our server component
    if (dateRange.startDate) {
      updatedQuery.startDate = formatISO(dateRange.startDate);
    }

    if (dateRange.endDate) {
      updatedQuery.endDate = formatISO(dateRange.endDate);
    }

    // create final url, for our user's search
    // turn object back into url string for hitting our server component
    const url = qs.stringifyUrl(
      {
        url: "/",
        query: updatedQuery,
      },
      { skipNull: true }
    );

    //reset steps

    setStep(STEPS.LOCATION);
    searchModal.onClose();

    //redirect to custom url that will return our data as the user's search results
    router.push(url);
  }, [
    guestCount,
    roomCount,
    bathroomCount,
    step,
    searchModal,
    location,
    dateRange,
    params,
    onNext,
    router,
  ]);

  // create action labels
  const actionLabel = useMemo(() => {
    // IF ON LAST STEP, return 'search' for our button label as it's our last step and will push to the new url
    if (step === STEPS.INFO) {
      return "Search";
    }

    return "Next";
  }, [step]);

  const secondaryActionLabel = useMemo(() => {
    // IF ON FIRST STEP, return UNDEFINED as there's no way to go back at that point
    if (step === STEPS.LOCATION) {
      return undefined;
    }

    return "Back";
  }, [step]);

  let bodyContent = (
    <div className='flex flex-col gap-8'>
      <Heading
        title='Where do you want to go?'
        subtitle='Find the perfect location!'
        center={true}
      />

      <CountrySelect
        value={location}
        onChange={(value) => setLocation(value as CountrySelectValue)}
      />
      <hr />
      <Map center={location?.latlng} />
    </div>
  );

  if (step === STEPS.DATE) {
    bodyContent = (
      <div className='flex flex-col gap-8'>
        <Heading
          title='When do you plan to go?'
          subtitle='Make sure everyone is free!'
          center={true}
        />
        <Calendar
          value={dateRange}
          onChange={(value) => setDateRange(value.selection)}
        />
      </div>
    );
  }

  if (step === STEPS.INFO) {
    bodyContent = (
      <div className='flex flex-col gap-8'>
        <Heading
          title='More information'
          subtitle='Find your perfect place!'
          center={true}
        />
        <Counter
          onChange={(value) => setGuestCount(value)}
          value={guestCount}
          title='Guests'
          subtitle='How many guests are coming?'
        />
        <hr />
        <Counter
          onChange={(value) => setRoomCount(value)}
          value={roomCount}
          title='Rooms'
          subtitle='How many rooms do you need?'
        />
        <hr />
        <Counter
          onChange={(value) => {
            setBathroomCount(value);
          }}
          value={bathroomCount}
          title='Bathrooms'
          subtitle='How many bahtrooms do you need?'
        />
      </div>
    );
  }

  return (
    <Modal
      disabled={isLoading}
      isOpen={searchModal.isOpen}
      title='Filters'
      actionLabel={actionLabel}
      onClose={searchModal.onClose}
      secondaryActionLabel={secondaryActionLabel}
      secondaryAction={step === STEPS.LOCATION ? undefined : onBack}
      onSubmit={onSubmit}
      body={bodyContent}
      //footer={footerContent}
    />
  );
};

export default SearchModal;
