import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import styles from "../style/pages/AddListing.module.css";
import { Listing, Geo, DaySchedule } from "../data/model/listingModel";
import { uploadListingImages } from "../services/firebase/storage/listingImageService";
import { createListingPipeline } from "../services/firebase/listing/listingPipeline.js";
import { useAuth } from "../contexts/authContext";
import { useToast } from "../contexts/toastContext";
import { useListingDraft } from "../contexts/ListingDraftContext";
import { ResetIcon, DraftIcon, TickIcon, PreviewIcon } from "../assets/collection.jsx";
import {
  TextInput,
  TextArea,
  SelectInput,
  ToggleSwitch,
  TagInput,
  ImageUploader,
  SectionCard,
  KeyValueFields, 
  CurrentLocationPicker, 
  Button, 
  SearchableSelect,
} from "../components";
import { useCategories } from "../hooks/useAllCategories";
import OpenHours, { defaultHours } from "../components/OpenHours";

/* ─── Validation Schema ─────────────────────────────────── */
const schema = z.object({
  shopName:       z.string().min(2, "Shop name must be at least 2 characters"),
  ownerName:      z.string().min(2, "Owner name is required"),
  category:       z.string().min(1, "Please select a category"),
  address:        z.string().min(5, "Please enter a valid address"),
  phone:          z.string().min(10, "Enter a valid phone number"),
  altPhone:       z.string().optional(),
  email:          z.string().email("Enter a valid email address").or(z.literal("")).optional(),
  whatsapp:       z.string().optional(),
  website:        z.string().url("Enter a valid URL").or(z.literal("")).optional(),
  instagram:      z.string().url("Enter a valid URL").or(z.literal("")).optional(),
  facebook:       z.string().url("Enter a valid URL").or(z.literal("")).optional(),
  linkedin:       z.string().url("Enter a valid URL").or(z.literal("")).optional(),
  since:          z.string().optional(),
  description:    z.string().optional(),
  onlinePayments: z.boolean(),
  customDetails:  z.string().optional(),
  geo: z.object({
    lat: z.number(),
    lng: z.number(),
  }).optional(),
  detailFields: z.array(
    z.object({
      key:   z.string(),
      value: z.string(),
    })
  ),
  hours:  z.any(),
  images: z.any(),
  tags:   z.array(z.string()),
});

const DEFAULT_VALUES = {
  addedBy: "", shopName: "", ownerName: "", category: "", address: "",
  phone: "", altPhone: "", email: "",
  whatsapp: "", website: "", instagram: "", facebook: "", linkedin: "",
  since: "", description: "", onlinePayments: true,
  customDetails: "", geo: { lat: 0, lng: 0 },
  detailFields: [{ key: "", value: "" }],
  hours: defaultHours(),
  images: [],
  tags: [],
};

const DRAFT_KEY = "add-listing-draft";

/* ─── Icons ─────────────────────────────────────────────── */
const Ico = {
  store:    (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l1-5h16l1 5"/><path d="M3 9h18v11a1 1 0 01-1 1H4a1 1 0 01-1-1V9z"/><path d="M9 21V12h6v9"/></svg>),
  contact:  (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 01-2.18 2A19.79 19.79 0 012.08 4.18 2 2 0 014 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>),
  social:   (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>),
  info:     (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>),
  detail:   (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>),
  clock:    (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>),
  photo:    (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="3"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>),
  tag:      (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>),
  phone:    (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 01-2.18 2A19.79 19.79 0 012.08 4.18 2 2 0 014 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>),
  mail:     (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>),
  web:      (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg>),
  wa:       (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"/></svg>),
  location: (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>),
  calendar: (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>),
  instagram:(<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>),
  facebook: (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/></svg>),
  linkedin: (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>),
};

/* ─── Main Page ─────────────────────────────────────────── */
export default function AddListing() {  
  const navigate = useNavigate()
  const { showToast } = useToast();
  const { userData } = useAuth();
  const { draftFormData, setDraftFormData, clearDraftFormData } = useListingDraft();

  const { data: categories = [], isLoading: categoryLoading } = useCategories();

  const {
    register,
    control,
    handleSubmit,
    getValues,
    setValue,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: DEFAULT_VALUES,
    mode: "onTouched",
  });

  // useFieldArray for the key-value detail fields
  const { fields, append, remove } = useFieldArray({
    control,
    name: "detailFields",
  });

  const category = watch("category");

  // Restore draft on mount
  useEffect(() => {
    if (draftFormData) {
      reset(draftFormData);
    } else {
      reset(DEFAULT_VALUES);
    }
  }, [draftFormData, reset]);

  const handleCancel = () => {
    clearDraftFormData();
    reset(DEFAULT_VALUES);
    showToast("Form reset successfully.", "regular");
  };

  const handleSaveDraft = () => {
    const formData = getValues();

    const payload = {
      ...formData,
      addedBy: userData?.name || "",
    };

    setDraftFormData(payload);
    showToast("Draft saved successfully without images.", "regular");
  };

  const goToPreview = () => {
    const formData = getValues();

    const payload = {
      ...formData,
      addedBy: userData?.name || "",
    };

    setDraftFormData(payload);

    navigate("/contribute/listing/preview");
  };


  const onError = (errs) => {
    const firstKey = Object.keys(errs)[0];
    document.getElementById(firstKey)?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  const quickAddTag = (tag, currentTags, onChange) => {
    if (!currentTags.includes(tag)) onChange([...currentTags, tag]);
  };

  return (
    <div className={styles.page}>

      {/* ── Hero ── */}
      <div className={styles.hero}>
        <div className={styles.heroInner}>
          <div className={styles.heroBadge}>Free Listing</div>
          <h1 className={styles.heroTitle}>List Your Business on NeedMet</h1>
          <p className={styles.heroSub}>
            Reach thousands of local customers. Fill in your details below and go live in minutes.
          </p>
          <div className={styles.heroSteps}>
            {["Basic Info", "Contact", "Social", "Details", "Info", "Hours", "Images", "Tags"].map((s, i) => (
              <div key={s} className={styles.heroStep}>
                <span className={styles.heroStepNum}>{i + 1}</span>
                <span className={styles.heroStepLabel}>{s}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <form
        className={styles.formWrap}
        onSubmit={handleSubmit(goToPreview, onError)}
        onKeyDown={(e) => {
          const tag = e.target.tagName;
          const isTextarea = tag === "TEXTAREA";
          const isTagInput = e.target.dataset.enterAllowed === "true";

          if (e.key === "Enter" && !isTextarea && !isTagInput) {
            e.preventDefault();
          }
        }}
        noValidate
      >

        {/* ── 1. Basic Details ── */}
        <SectionCard step={1} title="Basic Details" subtitle="Tell us about your shop or service." icon={Ico.store} sectionStyle={{overflow: 'visible'}}>
          <div className={styles.grid2}>
            <Controller
              name="shopName"
              control={control}
              render={({ field }) => (
                <TextInput
                  id="shopName"
                  label="Shop / Service Name"
                  required
                  icon={Ico.store}
                  error={errors.shopName?.message}
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  name={field.name}
                />
              )}
            />

            <Controller
              name="ownerName"
              control={control}
              render={({ field }) => (
                <TextInput
                  id="ownerName"
                  label="Owner Name"
                  required
                  error={errors.ownerName?.message}
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  name={field.name}
                />
              )}
            />
          </div>
          <div className={styles.grid2}>

            <Controller
              name="category"
              control={control}
              render={({ field }) => (
                <SearchableSelect
                  id="category"
                  label="Category"
                  required
                  error={errors.category?.message}
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  options={categories}
                  loading={categoryLoading}
                  getOptionLabel={(item) => item.name}
                  getOptionValue={(item) => item.name}
                  getOptionImage={(item) => item.imageUrl}
                  searchPlaceholder="Search category..."
                  noOptionsText="No category found"
                />
              )}
            />

            <div className={styles.locationCard}>
              <Controller
                name="address"
                control={control}
                render={({ field }) => (
                  <TextInput
                    id="address"
                    label="Address"
                    required
                    icon={Ico.location}
                    style={{ width: "100%" }}
                    placeholder="Street, Area, City"
                    error={errors.address?.message}
                    value={field.value}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    name={field.name}
                    disabled={true}
                  />
                )}
              />

              <CurrentLocationPicker
                onLocationSelect={(location) => {
                  setValue("address", location.address, {
                    shouldValidate: true,
                    shouldDirty: true,
                  });

                  setValue(
                    "geo",
                    {
                      lat: location.latitude,
                      lng: location.longitude,
                    },
                    {
                      shouldDirty: true,
                    }
                  );
                }}
              />
            </div>
          </div>
        </SectionCard>

        {/* ── 2. Contact Details ── */}
        <SectionCard step={2} title="Contact Details" subtitle="How customers can reach you." icon={Ico.contact}>
          <div className={styles.grid3}>
            <Controller
              name="phone"
              control={control}
              render={({ field }) => (
                <TextInput
                  {...field}
                  id="phone"
                  label="Phone Number"
                  type="tel"
                  required
                  icon={Ico.phone}
                  placeholder="XXXXX XXXXX"
                  error={errors.phone?.message}
                />
              )}
            />

            <Controller
              name="altPhone"
              control={control}
              render={({ field }) => (
                <TextInput
                  {...field}
                  id="altPhone"
                  label="Alternate Phone"
                  type="tel"
                  icon={Ico.phone}
                  placeholder="XXXXX XXXXX"
                />
              )}
            />

            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <TextInput
                  {...field}
                  id="email"
                  label="Email Address"
                  type="email"
                  icon={Ico.mail}
                  placeholder="you@example.com"
                  error={errors.email?.message}
                />
              )}
            />
          </div>
        </SectionCard>

        {/* ── 3. Social Media ── */}
        <SectionCard step={3} title="Social Media Info" subtitle="Help customers find and follow you online." icon={Ico.social}>
          <div className={styles.grid2}>
            <Controller
              name="whatsapp"
              control={control}
              render={({ field }) => (
                <TextInput
                  {...field}
                  id="whatsapp"
                  label="WhatsApp Number"
                  type="tel"
                  icon={Ico.wa}
                  placeholder="+91 XXXXX XXXXX"
                  value={field.value || ""}
                />
              )}
            />

            <Controller
              name="website"
              control={control}
              render={({ field }) => (
                <TextInput
                  {...field}
                  id="website"
                  label="Website URL"
                  type="url"
                  icon={Ico.web}
                  placeholder="https://yoursite.com"
                  error={errors.website?.message}
                  value={field.value || ""}
                />
              )}
            />
          </div>

          <div className={styles.grid3}>
            <Controller
              name="instagram"
              control={control}
              render={({ field }) => (
                <TextInput
                  {...field}
                  value={field.value || ""}
                  id="instagram"
                  label="Instagram"
                  type="url"
                  icon={Ico.instagram}
                  placeholder="https://instagram.com/…"
                  error={errors.instagram?.message}
                />
              )}
            />

            <Controller
              name="facebook"
              control={control}
              render={({ field }) => (
                <TextInput
                  {...field}
                  value={field.value || ""}
                  id="facebook"
                  label="Facebook"
                  type="url"
                  icon={Ico.facebook}
                  placeholder="https://facebook.com/…"
                  error={errors.facebook?.message}
                />
              )}
            />

            <Controller
              name="linkedin"
              control={control}
              render={({ field }) => (
                <TextInput
                  {...field}
                  value={field.value || ""}
                  id="linkedin"
                  label="LinkedIn"
                  type="url"
                  icon={Ico.linkedin}
                  placeholder="https://linkedin.com/…"
                  error={errors.linkedin?.message}
                />
              )}
            />
          </div>
        </SectionCard>

        {/* ── 4. Common Details ── */}
        <SectionCard step={4} title="Common Details" subtitle="A bit more about your business." icon={Ico.info}>
          <div className={styles.grid2}>
            <Controller
              name="since"
              control={control}
              render={({ field }) => (
                <TextInput
                  {...field}
                  value={field.value || ""}
                  id="since"
                  label="In business since"
                  type="number"
                  icon={Ico.calendar}
                  placeholder="e.g. 2015"
                />
              )}
            />
            <div className={styles.toggleCard}>
              <div>
                <p className={styles.toggleCardTitle}>Accept Online Payments</p>
                <p className={styles.toggleCardSub}>UPI, cards, wallets, net banking</p>
              </div>
              <Controller name="onlinePayments" control={control} render={({ field }) => (
                <ToggleSwitch name={field.name} checked={field.value}
                  onChange={(e) => field.onChange(e.target.checked)} />
              )} />
            </div>
          </div>
          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <TextArea
                {...field}
                value={field.value || ""}
                id="description"
                label="Business Description"
                rows={4}
                placeholder="Describe what you offer, your speciality, what makes you stand out…"
              />
            )}
          />
        </SectionCard>

        {/* ── 5. Detailed Info — key/value pairs ── */}
        <SectionCard step={5} title="Detailed Info" subtitle="Add any details specific to your business as label–value pairs." icon={Ico.detail}>

              <KeyValueFields
                fields={fields}
                register={register}
                append={append}
                remove={remove}
                name="detailFields"
                keyPlaceholder="Label (e.g. Cuisine, Speciality)"
                valuePlaceholder="Value (e.g. Indian, Dermatology)"
              />
        
        </SectionCard>

        {/* ── 6. Open Hours ── */}
        <SectionCard step={6} title="Open Hours" subtitle="Let customers know when you're available." icon={Ico.clock}>
          <Controller 
            name="hours" 
            control={control} 
            render={({ field }) => (
              <OpenHours
                hours={field.value}
                onChange={(day, val) => field.onChange({ ...field.value, [day]: val })}
              />
            )} 
          />
        </SectionCard>

        {/* ── 7. Upload Images ── */}
        <SectionCard step={7} title="Upload Images" subtitle="Great photos attract more customers. First image becomes the cover." icon={Ico.photo}>
          <Controller 
            name="images" 
            control={control} 
            render={({ field }) => (
              <ImageUploader
                images={field.value}
                onAdd={(newImages) => field.onChange([...(field.value || []), ...newImages])}
                onRemove={(i) => field.onChange(field.value.filter((_, idx) => idx !== i))}
                maxFiles={20} maxSizeMB={20}
              />
            )} 
          />
        </SectionCard>

        {/* ── 8. Tags ── */}
        <SectionCard step={8} title="Add Tags" subtitle="Tags help customers discover you through search." icon={Ico.tag}>
          <Controller 
            name="tags" 
            control={control} 
            render={({ field }) => (
              <>
                <TagInput 
                  tags={field.value} 
                  onChange={field.onChange} 
                  placeholder="Type a tag and press Enter…" 
                />
                
                <p className={styles.tagHint}>
                  Examples:{" "}
                  {["home delivery", "24/7", "parking available", "AC"].map((t) => (
                    <span key={t} onClick={() => quickAddTag(t, field.value, field.onChange)}>{t}</span>
                  ))}
                </p>
              </>
            )} 
          />
        </SectionCard>

        {/* ── Action Bar ── */}
        <div className={styles.actionBar}>
          <Button type='button' variant='outline' onClick={handleCancel} className={styles.resetBtn}>
            <ResetIcon size={14}/>
            Reset
          </Button>

          <div className={styles.actionRight}>

            <Button type="button" variant="secondary" style={{width: '100%'}} onClick={handleSaveDraft}>
              <DraftIcon size={14}/>
              Save Draft
            </Button>


            <Button type="submit" variant="primary" style={{width: '100%'}}>
              <PreviewIcon size={14}/>
              Preview
            </Button>

          </div>
        </div>

      </form>
    </div>
  );
}