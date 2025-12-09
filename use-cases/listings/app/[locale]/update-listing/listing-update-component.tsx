import { Issue, Listing } from "@/app/model/types";
import ListingAttributesEditorComponent from "@/app/components/listing-attributes-editor-component";
import IssuesButton from "@/app/components/issues-button";
import {
  PATCH_LISTINGS_ITEM_API_NAME,
  PUT_LISTINGS_ITEM_API_NAME,
  UPDATE_LISTING_USE_CASE,
} from "@/app/constants/global";
import { Box, Grid, Link } from "@mui/material";
import { DividerComponent } from "@/app/components/divider-component";
import AlertComponent from "@/app/components/alert";
import { useTranslations } from "use-intl";
import FormDropDownComponent from "@/app/components/form-drop-down-component";
import { useStateForDropDown } from "@/app/hooks/useStateForDropDown";

/**
 * Component which renders the Attributes Form with the listing data fetched
 * from Amazon.
 * @param sku the SKU of the listing.
 * @param currentListing the current listing at Amazon.
 * @constructor
 */
export default function ListingUpdateComponent({
  sku,
  currentListing,
}: {
  sku: string;
  currentListing: Listing;
}) {
  const translationNamespace = "UpdateListing";

  return (
    <RenderComponents
      currentListing={currentListing}
      sku={sku}
      translationNamespace={translationNamespace}
    />
  );
}

function RenderComponents({
  currentListing,
  sku,
  translationNamespace,
}: {
  currentListing: Listing;
  sku: string;
  translationNamespace: string;
}) {
  const translations = useTranslations(translationNamespace);

  if (Object.keys(currentListing).length === 0) {
    return (
      <Box marginTop={5}>
        <AlertComponent
          id={"no-sku-alert"}
          state={true}
          stateHandler={() => {}}
          severity={"info"}
          message={translations("noSkuFoundMessage")}
          staticAlert={true}
        />
      </Box>
    );
  } else {
    // Debug logs to inspect the listing shape and attributes available
    try {
      // Full listing object
      console.log("[UpdateListing] currentListing:", currentListing);
      // Common fields
      console.log(
        "[UpdateListing] productType:",
        (currentListing as any)?.productType,
      );
      console.log(
        "[UpdateListing] attributes:",
        (currentListing as any)?.attributes,
      );
      console.log("[UpdateListing] issues:", (currentListing as any)?.issues);
      console.log("[UpdateListing] summary:", (currentListing as any)?.summary);
      console.log(
        "[UpdateListing] identifiers:",
        (currentListing as any)?.identifiers,
      );
      // Potential ASIN locations
      const debugAsinCandidates = {
        identifiersIndex0Asin: (currentListing as any)?.identifiers?.[0]?.asin,
        summaryAsin: (currentListing as any)?.summary?.asin,
        rootAsin: (currentListing as any)?.asin,
      };
      console.log("[UpdateListing] ASIN candidates:", debugAsinCandidates);
    } catch (e) {
      console.warn("[UpdateListing] Failed to log listing details:", e);
    }

    // Try to extract ASIN from the loaded listing, if present
    const asin =
      (currentListing as any)?.identifiers?.[0]?.asin ||
      (currentListing as any)?.summary?.asin ||
      (currentListing as any)?.asin;

    const amazonHref = asin
      ? `https://www.amazon.com/dp/${encodeURIComponent(asin)}`
      : `https://www.amazon.com/s?k=${encodeURIComponent(sku)}`;

    return (
      <Grid item>
        <DividerComponent />
        {/* Link to open the Amazon page for the loaded ASIN (fallback to SKU search) */}
        {(asin || sku) && (
          <Box sx={{ margin: "0.5rem 0" }}>
            <Link
              href={amazonHref}
              target="_blank"
              rel="noopener noreferrer"
              underline="hover"
            >
              Open on Amazon
            </Link>
          </Box>
        )}
        {currentListing.productType ? (
          <AttributesEditorWithIssues
            sku={sku}
            productType={currentListing.productType}
            currentListing={currentListing.attributes}
            currentIssues={currentListing.issues}
            translationNamespace={translationNamespace}
          />
        ) : (
          <NoSummaryComponent
            warningMessage={translations("noSummaryWarning")}
            currentIssues={currentListing.issues}
          />
        )}
      </Grid>
    );
  }
}

function AttributesEditorWithIssues({
  sku,
  productType,
  currentListing,
  translationNamespace,
  currentIssues,
}: {
  sku: string;
  productType: string;
  currentListing: object;
  translationNamespace: string;
  currentIssues?: Issue[];
}) {
  const translations = useTranslations(translationNamespace);
  const [writeOperation, handleWriteOperationChange] = useStateForDropDown(
    PUT_LISTINGS_ITEM_API_NAME,
  );

  const validWriteOperations = [
    {
      key: PUT_LISTINGS_ITEM_API_NAME,
      label: PUT_LISTINGS_ITEM_API_NAME,
    },
    {
      key: PATCH_LISTINGS_ITEM_API_NAME,
      label: PATCH_LISTINGS_ITEM_API_NAME,
    },
  ];

  return (
    <Grid>
      <Grid item sx={{ margin: "1rem 0" }}>
        {currentIssues && currentIssues.length > 0 && (
          <IssuesButton issues={currentIssues} />
        )}
      </Grid>
      <Grid item sx={{ margin: "1rem 0" }}>
        <FormDropDownComponent
          id={"writeOperation"}
          label={translations("writeOperationLabel")}
          helpText={translations("writeOperationHelpText")}
          onChange={handleWriteOperationChange}
          selectedKey={writeOperation}
          options={validWriteOperations}
        />
      </Grid>
      <Grid item>
        <ListingAttributesEditorComponent
          sku={sku}
          productType={productType}
          useCase={UPDATE_LISTING_USE_CASE}
          initialListing={currentListing}
          writeOperation={writeOperation}
        />
      </Grid>
    </Grid>
  );
}

function NoSummaryComponent({
  warningMessage,
  currentIssues,
}: {
  warningMessage: string;
  currentIssues?: Issue[];
}) {
  return (
    <>
      <AlertComponent
        id={"no-summary-alert"}
        state={true}
        stateHandler={() => {}}
        severity={"warning"}
        message={warningMessage}
        staticAlert={true}
      />
      {currentIssues && currentIssues.length > 0 && (
        <IssuesButton issues={currentIssues} />
      )}
    </>
  );
}
