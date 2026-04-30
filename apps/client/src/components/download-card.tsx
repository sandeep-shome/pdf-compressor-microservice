import { ArrowDown, ChevronLeft, FileCheck } from "lucide-react";
import React from "react";
import { Link } from "react-router";
import DownloadButton from "./download-button";
import { formatSize } from "@/lib/utils";
import type { FileMeta } from "@/hooks/use-get-file-meta";

interface DownloadCardProps extends FileMeta {
  id: string;
  loading: boolean;
}

const DownloadCard: React.FC<DownloadCardProps> = (props) => {
  return (
    <div className="p-6 md:p-8 space-y-6">
      <div className="flex items-center gap-4">
        <div
          className={`w-12 h-12 rounded-lg flex items-center justify-center shrink-0 ${props.loading ? "bg-gray-200 animate-pulse" : "bg-green-100 text-green-600"}`}
        >
          {!props.loading && <FileCheck size={28} />}
        </div>
        <div className="min-w-0 flex-1">
          {props.loading ? (
            <div className="space-y-2">
              <div className="h-5 bg-gray-200 animate-pulse w-3/4 rounded-md" />
              <div className="h-3 bg-gray-100 animate-pulse w-1/2 rounded-md" />
            </div>
          ) : (
            <>
              <h1 className="text-xl font-bold text-gray-900 tracking-tight">
                Compression Complete
              </h1>
              <p className="text-sm text-gray-500 truncate max-w-50 sm:max-w-xs">
                {props.name || "document.pdf"}
              </p>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 py-4 border-y border-gray-100">
        {/* Before Stats */}
        <div className="text-center">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tight mb-1">
            Before
          </p>
          {props.loading ? (
            <div className="h-4 bg-gray-100 animate-pulse w-12 mx-auto rounded" />
          ) : (
            <p className="text-sm font-semibold text-gray-700">
              {formatSize(props.originalSize)}
            </p>
          )}
        </div>

        <div className="text-center border-x border-gray-100">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tight mb-1">
            After
          </p>
          {props.loading ? (
            <div className="h-4 bg-gray-100 animate-pulse w-12 mx-auto rounded" />
          ) : (
            <p className="text-sm font-bold text-green-600">
              {formatSize(props.compressedSize)}
            </p>
          )}
        </div>

        <div className="text-center">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tight mb-1">
            Saved
          </p>
          {props.loading ? (
            <div className="h-4 bg-gray-100 animate-pulse w-8 mx-auto rounded" />
          ) : (
            <p className="text-sm font-black text-blue-600">
              {Math.round(
                ((props.originalSize - props.compressedSize) /
                  props.originalSize) *
                  100,
              )}
              %
            </p>
          )}
        </div>
      </div>

      <div className="space-y-3">
        {props.loading ? (
          <div className="w-full h-14 bg-gray-200 animate-pulse rounded-xl" />
        ) : (
          <DownloadButton
            fileId={props.id}
            fileName={props.name || "document.pdf"}
          />
        )}

        <Link
          to="/"
          className="flex items-center justify-center gap-2 w-full py-3 text-sm font-bold text-gray-500 hover:text-gray-800 transition-colors"
        >
          <ChevronLeft size={16} />
          Compress another file
        </Link>
      </div>

      <div
        className={`p-3 rounded-lg flex items-center gap-3 transition-colors ${props.loading ? "bg-gray-50" : "bg-blue-50"}`}
      >
        {props.loading ? (
          <div className="h-4 bg-gray-200 animate-pulse w-full rounded" />
        ) : (
          <>
            <ArrowDown size={16} className="text-blue-500 shrink-0" />
            <p className="text-xs text-blue-700 font-medium leading-tight">
              You just saved{" "}
              <strong>
                {formatSize(props.originalSize - props.compressedSize)}
              </strong>{" "}
              of storage space!
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default DownloadCard;
