import { BoxProps, Flex, Grid, Text } from "@chakra-ui/react";
import {
  ProgressBar,
  RenderPage,
  RenderPageProps,
  SpecialZoomLevel,
  Viewer,
  Worker,
} from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import {
  ExitFullScreenIcon,
  FullScreenIcon,
  fullScreenPlugin,
} from "@react-pdf-viewer/full-screen";
import "@react-pdf-viewer/full-screen/lib/styles/index.css";
import { pageNavigationPlugin } from "@react-pdf-viewer/page-navigation";
import "@react-pdf-viewer/page-navigation/lib/styles/index.css";
import { searchPlugin } from "@react-pdf-viewer/search";
import "@react-pdf-viewer/search/lib/styles/index.css";
import {
  toolbarPlugin,
  ToolbarSlot,
  TransformToolbarSlot,
} from "@react-pdf-viewer/toolbar";
import { zoomPlugin } from "@react-pdf-viewer/zoom";
import * as pdfjs from "pdfjs-dist";
import { useEffect, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
import EventBus from "../../EventBus";
import { userStore } from "../../store/userStore";
import { FeatureIdentifiers } from "../../utils/constants/constants";
import { isAbfl } from "../../utils/constants/endpoints";
import { systemColors } from "../DesignSystem/Colors/SystemColors";
import { EVENT_PDF_LOADED } from "../PolyGPT/components/ConversationBox";
import { fallbackRender } from "./ErrorFallback";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

interface PdfViewerProps extends BoxProps {
  pdfUrl: string;
  refetch: () => void;
  className?: string;
}
let timer: string | number | NodeJS.Timeout | undefined;
export const EVENT_OPEN_PDF_PAGE = "EVENT_OPEN_PDF_PAGE";

export default function PdfViewer2({
  pdfUrl,
  className,
  refetch,
  ...props
}: PdfViewerProps) {
  const { name, organisationName, sourceEmployeeId } = userStore();
  const pageNavigationPluginInstance = pageNavigationPlugin({
    enableShortcuts: true,
  });
  const searchPluginInstance = searchPlugin({ enableShortcuts: true });
  const zoomPluginInstance = zoomPlugin({ enableShortcuts: true });

  const toolbarPluginInstance = toolbarPlugin();
  const { renderDefaultToolbar } = toolbarPluginInstance;
  const { enabledFeature } = userStore();
  const showWatermark = enabledFeature.includes(FeatureIdentifiers.WATERMARK);

  const handleCustomFullScreen = async () => {
    try {
      // Check current full screen state dynamically
      const currentFullScreenState = !!(
        document.fullscreenElement ||
        (document as any).webkitFullscreenElement ||
        (document as any).mozFullScreenElement ||
        (document as any).msFullscreenElement
      );

      if (!currentFullScreenState) {
        // Enter full screen
        const element = document.querySelector(
          '[data-testid="default-layout__main"]',
        ) as HTMLElement;

        if (element) {
          if (element.requestFullscreen) {
            await element.requestFullscreen();
          } else if ((element as any).webkitRequestFullscreen) {
            await (element as any).webkitRequestFullscreen();
          } else if ((element as any).mozRequestFullScreen) {
            await (element as any).mozRequestFullScreen();
          } else if ((element as any).msRequestFullscreen) {
            await (element as any).msRequestFullscreen();
          }
        }
      } else {
        // Exit full screen
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        } else if ((document as any).webkitExitFullscreen) {
          await (document as any).webkitExitFullscreen();
        } else if ((document as any).mozCancelFullScreen) {
          await (document as any).mozCancelFullScreen();
        } else if ((document as any).msExitFullscreen) {
          await (document as any).msExitFullscreen();
        }
      }
    } catch (error) {
      console.error("Full screen operation failed:", error);
    }
  };

  const fullScreenPluginInstance = fullScreenPlugin();

  const transform: TransformToolbarSlot = (slot: ToolbarSlot) => ({
    ...slot,
    Download: () => <></>,
    DownloadMenuItem: () => <></>,
    Open: () => <></>,
    OpenMenuItem: () => <></>,
    Print: () => <></>,
    PrintMenuItem: () => <></>,
    Rotate: () => <></>,
    RotateBackwardMenuItem: () => <></>,
    RotateForwardMenuItem: () => <></>,
    ShowProperties: () => <></>,
    ShowPropertiesMenuItem: () => <></>,
    SwitchScrollMode: () => <></>,
    SwitchScrollModeMenuItem: () => <></>,
    SwitchSelectionMode: () => <></>,
    SwitchSelectionModeMenuItem: () => <></>,
    SwitchViewMode: () => <></>,
    SwitchViewModeMenuItem: () => <></>,
    // Replace the default full screen with our custom implementation
    EnterFullScreen: () => (
      <button
        onClick={handleCustomFullScreen}
        className="rpv-core__minimal-button"
        title={(() => {
          const actualFullScreenState = !!(
            document.fullscreenElement ||
            (document as any).webkitFullscreenElement ||
            (document as any).mozFullScreenElement ||
            (document as any).msFullscreenElement
          );
          return actualFullScreenState
            ? "Exit full screen"
            : "Enter full screen";
        })()}
        style={{
          padding: "8px",
          border: "none",
          background: "transparent",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {(() => {
          // Check actual document state for icon display
          const actualFullScreenState = !!(
            document.fullscreenElement ||
            (document as any).webkitFullscreenElement ||
            (document as any).mozFullScreenElement ||
            (document as any).msFullscreenElement
          );

          return actualFullScreenState ? (
            <ExitFullScreenIcon />
          ) : (
            <FullScreenIcon />
          );
        })()}
      </button>
    ),
    EnterFullScreenMenuItem: () => <></>,
  });

  const defaultLayoutPluginInstance = defaultLayoutPlugin({
    renderToolbar: (Toolbar) => (
      <Toolbar>{renderDefaultToolbar(transform)}</Toolbar>
    ),
    sidebarTabs: () => [],
  });

  const renderPage: RenderPage = (props: RenderPageProps) => (
    <>
      {props.canvasLayer.children}
      {showWatermark && (
        <div
          style={{
            alignItems: "center",
            display: "flex",
            height: "100%",
            justifyContent: "center",
            left: 0,
            position: "absolute",
            top: 0,
            width: "100%",
          }}
        >
          <Grid templateColumns={"repeat(1,1fr)"} rowGap={30} columnGap={30}>
            {Array.from({ length: 5 }).map((_, index) => (
              <Text
                key={index}
                fontSize="20px"
                opacity={0.3}
                lineHeight="38px"
                transform="rotate(-45deg)"
                transformOrigin="center"
                color={systemColors.red[400]}
                textAlign="center"
                className="select-none"
              >
                FOR {isAbfl ? "ABCL" : organisationName} USE ONLY; {name} - EMP
                ID - : {sourceEmployeeId}
              </Text>
            ))}
          </Grid>
        </div>
      )}
      {props.annotationLayer.children}
      {props.textLayer.children}
    </>
  );

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevents the default right-click context menu
  };

  const handleOpenPage = (pageNumber: number) => {
    pageNavigationPluginInstance.jumpToPage(pageNumber);
    timer = setTimeout(() => {
      setZoomToPageWidth();
    }, 1000);
  };

  const setZoomToPageWidth = () => {
    zoomPluginInstance.zoomTo(SpecialZoomLevel.PageWidth);
  };

  useEffect(() => {
    setTimeout(() => {
      EventBus.getInstance().addListener(EVENT_OPEN_PDF_PAGE, handleOpenPage);
    }, 0);
    return () => {
      EventBus.getInstance().removeListener(handleOpenPage);
      clearTimeout(timer);
    };
  }, []);

  const [isPdfLoaded, setIsPdfLoaded] = useState(false);

  const handlePdfLoad = () => {
    setIsPdfLoaded(true);
  };

  useEffect(() => {
    EventBus.getInstance().fireEvent(EVENT_PDF_LOADED, isPdfLoaded);
  }, [isPdfLoaded]);

  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    // Check if the URL returns XML error response
    const checkPdfUrl = async () => {
      try {
        const response = await fetch(pdfUrl);
        const text = await response.text();

        if (
          text.includes("<Error><Code>NoSuchKey</Code>") ||
          text.includes("<?xml")
        ) {
          setHasError(true);
        }
      } catch (error) {
        setHasError(true);
      }
    };

    checkPdfUrl();
  }, [pdfUrl]);

  if (hasError) {
    return fallbackRender({
      error: new Error("PDF file not found or inaccessible"),
      resetErrorBoundary: refetch,
    });
  }

  return (
    <ErrorBoundary fallbackRender={fallbackRender}>
      <Flex
        {...props}
        className={`h-full flex-grow flex-col transition-all flex overflow-y-auto border-none ${className}`}
        onContextMenu={handleContextMenu}
      >
        <Worker
          workerUrl={`https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`}
        >
          <Viewer
            renderPage={renderPage}
            fileUrl={pdfUrl}
            plugins={[
              defaultLayoutPluginInstance,
              pageNavigationPluginInstance,
              searchPluginInstance,
              zoomPluginInstance,
              fullScreenPluginInstance,
            ]}
            renderLoader={(percentages: number) => (
              <div className="my-10" style={{ width: "240px" }}>
                <ProgressBar progress={Math.round(percentages)} />
              </div>
            )}
            onDocumentLoad={handlePdfLoad}
          />
        </Worker>
      </Flex>
    </ErrorBoundary>
  );
}
