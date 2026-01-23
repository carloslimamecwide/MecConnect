import React from "react";
import { Image, View } from "react-native";
import { AppText } from "../Common/AppText";

type AttachmentsSectionProps = {
  attachmentsCount: number;
  form: {
    attachments: { imageFile: string }[];
  };
};

function AttachmentsSection({ attachmentsCount, form }: AttachmentsSectionProps) {
  return (
    <>
      {attachmentsCount > 0 ? (
        <View className="flex-row flex-wrap gap-2 mt-3">
          {form.attachments.map((a, i) => (
            <View key={i} className="rounded-lg border border-white/10 overflow-hidden">
              <Image
                source={{
                  uri: a.imageFile.startsWith("data:") ? a.imageFile : `data:image/jpeg;base64,${a.imageFile}`,
                }}
                style={{ width: 72, height: 72, backgroundColor: "#111" }}
              />
            </View>
          ))}
        </View>
      ) : (
        <View className="mt-3 rounded-lg border border-dashed border-white/10 p-4">
          <AppText className="text-xs text-gray-500">Nenhum anexo adicionado.</AppText>
        </View>
      )}
    </>
  );
}

export default AttachmentsSection;
