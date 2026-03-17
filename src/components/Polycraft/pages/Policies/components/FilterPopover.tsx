import { ChevronDownIcon, ChevronRightIcon } from "@chakra-ui/icons";
import {
  Button,
  Flex,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Portal,
  StackDivider,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import { Dispatch, SetStateAction, useState } from "react";
import { Filter } from "react-huge-icons/outline";
import { ISpocUser } from "../../../../../hooks/useGetPolicyManagersByCategory";
import { userStore } from "../../../../../store/userStore";
import CustomCheckbox from "../../../../CustomCheckbox";
import CustomText from "../../../../DesignSystem/Typography/CustomText";

const toggleItemInArray = (
  set: Set<string>,
  setFunction: Dispatch<SetStateAction<Set<string>>>,
  value: string,
  isParentCategory: boolean = false,
  childValues: string[] = [],
  isAllChildrenSelected: boolean = false
) => {
  const newSet = new Set(set);

  if (isParentCategory) {
    if (!newSet.has(value)) {
      // If selecting a parent category
      if (childValues.length === 0) {
        // If there are no children, just add the parent
        newSet.add(value);
      } else if (isAllChildrenSelected) {
        // If all children are already selected, replace them with the parent
        childValues.forEach((childValue) => {
          newSet.delete(childValue);
        });
        newSet.add(value);
      } else {
        // If parent being checked but not all children are selected,
        // add all the individual children instead
        childValues.forEach((childValue) => {
          newSet.add(childValue);
        });
      }
    } else {
      // If deselecting the parent, remove the parent
      newSet.delete(value);
    }
  } else {
    // For subcategory toggle
    if (newSet.has(value)) {
      newSet.delete(value);
    } else {
      newSet.add(value);
    }
  }

  setFunction(newSet);
};

const statusOptions = [
  { label: "Active", value: "active" },
  { label: "Deactivated", value: "deactivated" },
  { label: "Drafted", value: "drafted" },
  { label: "Rejected", value: "rejected" },
  { label: "Approved", value: "approved" },
  { label: "In-Review", value: "In-Review" },
];

// Define types for our content items
interface ContentItem {
  label: string;
  value: string;
  subOptions?: ContentItem[];
}

// Define type for our popover config
interface PopoverConfigItem {
  trigger: string;
  content?: ContentItem[];
  comp?: React.ReactNode;
  value?: Set<string>;
  count: number;
  onClick?: ((value: string) => void) | null;
  isCategory?: boolean;
}

const ITEMS_PER_PAGE = 10;

const FilterPopover = ({
  owner,
  setOwner,
  status,
  setStatus,
  spocUsers,
  categoryIds,
  setCategoryIds,
}: {
  owner: Set<string>;
  setOwner: Dispatch<SetStateAction<Set<string>>>;
  status: Set<string>;
  setStatus: Dispatch<SetStateAction<Set<string>>>;
  spocUsers: ISpocUser[];
  categoryIds: Set<string>;
  setCategoryIds: Dispatch<SetStateAction<Set<string>>>;
}) => {
  const {
    isOpen: isPopoverOpen,
    onOpen: onPopoverOpen,
    onClose: onPopoverClose,
  } = useDisclosure();
  const { loanCategories } = userStore();

  // State to track expanded categories
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set()
  );

  // Load more state - track how many items to show for each section
  const [policyManagersLimit, setPolicyManagersLimit] =
    useState(ITEMS_PER_PAGE);
  const [categoriesLimit, setCategoriesLimit] = useState(ITEMS_PER_PAGE);
  const [subcategoriesLimits, setSubcategoriesLimits] = useState<
    Record<string, number>
  >({});

  // Load more handlers
  const loadMorePolicyManagers = () => {
    setPolicyManagersLimit((prev) => prev + ITEMS_PER_PAGE);
  };

  const loadMoreCategories = () => {
    setCategoriesLimit((prev) => prev + ITEMS_PER_PAGE);
  };

  const loadMoreSubcategories = (categoryId: string) => {
    setSubcategoriesLimits((prev) => ({
      ...prev,
      [categoryId]: (prev[categoryId] || ITEMS_PER_PAGE) + ITEMS_PER_PAGE,
    }));
  };

  // Get subcategory limit for a category
  const getSubcategoryLimit = (categoryId: string) => {
    return subcategoriesLimits[categoryId] || ITEMS_PER_PAGE;
  };

  // Toggle category expansion
  const toggleCategoryExpansion = (
    categoryId: string,
    event?: React.MouseEvent
  ) => {
    if (event) {
      // Stop propagation to prevent triggering onClick of the parent button
      event.stopPropagation();
    }

    const newExpandedCategories = new Set(expandedCategories);
    if (newExpandedCategories.has(categoryId)) {
      newExpandedCategories.delete(categoryId);
    } else {
      newExpandedCategories.add(categoryId);

      // Initialize subcategory limit if not already set
      if (!subcategoriesLimits[categoryId]) {
        setSubcategoriesLimits((prev) => ({
          ...prev,
          [categoryId]: ITEMS_PER_PAGE,
        }));
      }
    }
    setExpandedCategories(newExpandedCategories);
  };

  // Helper to check if all subcategories of a category are selected
  const areAllSubcategoriesSelected = (
    subcategories: ContentItem[] | undefined
  ): boolean => {
    if (!subcategories || subcategories.length === 0) return false;
    return subcategories.every((subOption) => categoryIds.has(subOption.value));
  };

  // Helper to check if a category should appear checked
  const isCategoryChecked = (contentItem: ContentItem): boolean => {
    // If the category ID is directly in the set, it's checked
    if (categoryIds.has(contentItem.value)) return true;

    // If it has subcategories and all are checked, it should appear checked
    if (contentItem.subOptions && contentItem.subOptions.length > 0) {
      return areAllSubcategoriesSelected(contentItem.subOptions);
    }

    // Otherwise, not checked
    return false;
  };

  // When a category item is clicked
  const handleCategoryClick = (categoryItem: ContentItem) => {
    // Get all subcategory IDs
    const subcategoryIds =
      categoryItem.subOptions?.map((sub) => sub.value) || [];
    const allSubcategoriesSelected = areAllSubcategoriesSelected(
      categoryItem.subOptions
    );

    // Toggle the category with special handling
    toggleItemInArray(
      categoryIds,
      setCategoryIds,
      categoryItem.value,
      true,
      subcategoryIds,
      allSubcategoriesSelected
    );

    // Expand the category when selected if it has suboptions
    if (
      subcategoryIds.length > 0 &&
      !expandedCategories.has(categoryItem.value)
    ) {
      toggleCategoryExpansion(categoryItem.value);
    }
  };

  // When a subcategory item is clicked
  const handleSubcategoryClick = (subOption: ContentItem) => {
    // Toggle the subcategory
    toggleItemInArray(categoryIds, setCategoryIds, subOption.value);
  };

  const popoverConfig: PopoverConfigItem[] = [
    {
      trigger: "Policy Manager",
      content: spocUsers?.map((item) => ({
        label: item?.user_name,
        value: item?.id,
      })),
      value: owner,
      count: owner?.size || 0,
      onClick: (e: string) => {
        toggleItemInArray(owner, setOwner, e);
      },
    },
    {
      trigger: "Status",
      content: statusOptions,
      value: status,
      onClick: (e: string) => {
        toggleItemInArray(status, setStatus, e);
      },
      count: status?.size || 0,
    },
    {
      trigger: "Category",
      isCategory: true,
      content: loanCategories?.map((item) => ({
        label: item?.category_type,
        value: item?.id,
        subOptions: item?.subcategories?.map((subcat) => ({
          label: subcat?.category_type,
          value: subcat?.id,
        })),
      })),
      onClick: null,
      count: categoryIds?.size || 0,
    },
  ];

  const handleReset = () => {
    setOwner(new Set<string>());
    setStatus(new Set<string>());
    setCategoryIds(new Set<string>());
  };

  const areFiltersApplied = owner?.size || status?.size || categoryIds?.size;

  return (
    <Popover
      placement="right-start"
      autoFocus={false}
      closeOnBlur
      isOpen={isPopoverOpen}
      onClose={onPopoverClose}
    >
      <PopoverTrigger>
        <Flex
          className={`w-[54px] h-[54px] items-center justify-center border cursor-pointer rounded-[8px] hover:bg-[#F8F9FA] ${
            areFiltersApplied && "bg-[#F5F9FF]"
          }   "flex gap-2 w-fit  text-sm font-semibold px-5 py-2.5 !h-10 border-[#00000014] bg-[#00000005]"`}
          onClick={onPopoverOpen}
        >
          <Filter fontSize={"20px"} className="shrink-0" />
          Filter
        </Flex>
      </PopoverTrigger>
      <Portal>
        <PopoverContent className="w-fit border-none shadow-none">
          <VStack
            className="w-[224px] bg-white shadow-md border border-gray.200 rounded-[12px] p-2 max-h-[300px] overflow-y-auto"
            gap={0}
          >
            <CustomText
              className="self-end w-full text-right pr-2 pt-1 cursor-pointer"
              stylearr={[12, 20, 500]}
              color={"#2A4AA9"}
              as={"u"}
              onClick={handleReset}
            >
              Remove Filters
            </CustomText>
            {popoverConfig?.map((item, index) => {
              return (
                <>
                  <Popover key={item.trigger} placement="right-start">
                    <PopoverTrigger>
                      <button className="hover:bg-[linear-gradient(231deg,_rgba(55,_98,_221,_0)_13.46%,_rgba(55,_98,_221,_0.2)_194.11%)] rounded flex h-10 px-2 justify-between transition-all items-center w-full cursor-pointer">
                        <div className="flex items-center text-[12px] font-[500] leading-[16px] w-full">
                          <p className="capitalize">{item?.trigger}</p>
                        </div>
                        <div className="flex items-center">
                          {item?.count > 0 && (
                            <div className=" bg-[#F3F2F5] rounded-full h-6 w-6 p-1 flex items-center justify-center mr-1">
                              <span className="text-xs font-medium">
                                {item.count}
                              </span>
                            </div>
                          )}
                          <button className="min-w-[20px] w-[20px] h-[20px] flex justify-center items-center rounded-full group-hover:bg-[linear-gradient(231deg,_rgba(55,_98,_221,_0)_13.46%,_rgba(55,_98,_221,_0.2)_194.11%)] transition-all">
                            <ChevronRightIcon />
                          </button>
                        </div>
                      </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-fit shadow-none border-none p-0 bg-[transparent]">
                      {item?.comp ? (
                        item.comp
                      ) : (
                        <VStack
                          className="w-[213px] max-h-[300px] overflow-y-auto border-[1px] bg-white shadow-md border-gray.200 rounded-[12px] p-2"
                          divider={<StackDivider />}
                          gap={0}
                        >
                          {item?.content?.length ? (
                            <>
                              {(item.trigger === "Policy Manager"
                                ? item.content.slice(0, policyManagersLimit)
                                : item.trigger === "Category"
                                ? item.content.slice(0, categoriesLimit)
                                : item.content
                              ).map((contentItem: ContentItem) => (
                                <div
                                  key={contentItem?.value}
                                  className="w-full"
                                >
                                  <button className="p-2 hover:bg-[linear-gradient(231deg,_rgba(55,_98,_221,_0)_13.46%,_rgba(55,_98,_221,_0.2)_194.11%)] rounded flex justify-between transition-all items-center w-full gap-2 cursor-pointer">
                                    <button
                                      className="flex items-center gap-3 w-full text-[12px] font-[500] leading-[16px]"
                                      onClick={() => {
                                        if (item.isCategory) {
                                          handleCategoryClick(contentItem);
                                        } else if (item?.onClick) {
                                          item.onClick(contentItem?.value);
                                        }
                                      }}
                                    >
                                      <CustomCheckbox
                                        color="#176FC1"
                                        isChecked={
                                          item.isCategory
                                            ? isCategoryChecked(contentItem)
                                            : item?.value
                                            ? item.value.has(contentItem?.value)
                                            : false
                                        }
                                        borderRadius="4px"
                                      />
                                      <CustomText
                                        noOfLines={1}
                                        stylearr={[12, 18, 500]}
                                      >
                                        {contentItem?.label}
                                      </CustomText>
                                    </button>
                                    {/* Add chevron icon for categories with suboptions */}
                                    {item.isCategory &&
                                      contentItem.subOptions &&
                                      contentItem.subOptions.length > 0 && (
                                        <div
                                          onClick={(e) =>
                                            toggleCategoryExpansion(
                                              contentItem.value,
                                              e
                                            )
                                          }
                                          className="cursor-pointer"
                                        >
                                          {expandedCategories.has(
                                            contentItem.value
                                          ) ? (
                                            <ChevronDownIcon
                                              transform="rotate(180deg)"
                                              transition="transform 0.2s"
                                            />
                                          ) : (
                                            <ChevronDownIcon transition="transform 0.2s" />
                                          )}
                                        </div>
                                      )}
                                  </button>
                                  {/* Render suboptions if they exist and category is expanded */}
                                  {item.isCategory &&
                                    contentItem.subOptions &&
                                    contentItem.subOptions.length > 0 &&
                                    expandedCategories.has(
                                      contentItem.value
                                    ) && (
                                      <VStack className="pl-6" gap={0}>
                                        {/* Display limited subcategories */}
                                        {contentItem.subOptions
                                          .slice(
                                            0,
                                            getSubcategoryLimit(
                                              contentItem.value
                                            )
                                          )
                                          .map((subOption: ContentItem) => (
                                            <button
                                              key={subOption.value}
                                              className="p-2 hover:bg-[linear-gradient(231deg,_rgba(55,_98,_221,_0)_13.46%,_rgba(55,_98,_221,_0.2)_194.11%)] rounded flex justify-between transition-all items-center w-full gap-2 cursor-pointer"
                                              onClick={() => {
                                                handleSubcategoryClick(
                                                  subOption
                                                );
                                              }}
                                            >
                                              <div className="flex items-center gap-3 text-[12px] font-[500] leading-[16px]">
                                                <CustomCheckbox
                                                  color="#176FC1"
                                                  isChecked={
                                                    categoryIds.has(
                                                      contentItem.value
                                                    ) ||
                                                    categoryIds.has(
                                                      subOption.value
                                                    )
                                                  }
                                                  borderRadius="4px"
                                                />
                                                <CustomText
                                                  noOfLines={1}
                                                  stylearr={[12, 18, 400]}
                                                >
                                                  {subOption?.label}
                                                </CustomText>
                                              </div>
                                            </button>
                                          ))}

                                        {/* Load more button for subcategories */}
                                        {contentItem.subOptions.length >
                                          getSubcategoryLimit(
                                            contentItem.value
                                          ) && (
                                          <Button
                                            size="sm"
                                            variant="ghost"
                                            colorScheme="blue"
                                            className="w-full mt-2 text-xs"
                                            onClick={() =>
                                              loadMoreSubcategories(
                                                contentItem.value
                                              )
                                            }
                                          >
                                            Load More
                                          </Button>
                                        )}
                                      </VStack>
                                    )}
                                </div>
                              ))}

                              {/* Load more button for Policy Managers */}
                              {item.trigger === "Policy Manager" &&
                                item.content.length > policyManagersLimit && (
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    colorScheme="blue"
                                    className="w-full mt-2 text-xs"
                                    onClick={loadMorePolicyManagers}
                                  >
                                    Load More
                                  </Button>
                                )}

                              {/* Load more button for Categories */}
                              {item.trigger === "Category" &&
                                item.content.length > categoriesLimit && (
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    colorScheme="blue"
                                    className="w-full mt-2 text-xs"
                                    onClick={loadMoreCategories}
                                  >
                                    Load More
                                  </Button>
                                )}
                            </>
                          ) : (
                            <CustomText
                              noOfLines={1}
                              stylearr={[12, 18, 500]}
                              h={"100px"}
                              alignItems={"center"}
                              textAlign={"center"}
                            >
                              No Result Found
                            </CustomText>
                          )}
                        </VStack>
                      )}
                    </PopoverContent>
                  </Popover>
                  {index !== popoverConfig.length - 1 && <StackDivider />}
                </>
              );
            })}
          </VStack>
        </PopoverContent>
      </Portal>
    </Popover>
  );
};

export default FilterPopover;
