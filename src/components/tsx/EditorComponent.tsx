import {
    MDXEditor,
    type MDXEditorMethods,
    headingsPlugin,
    listsPlugin,
    quotePlugin,
    thematicBreakPlugin,
    markdownShortcutPlugin,
    codeBlockPlugin,
    codeMirrorPlugin,
    tablePlugin,
    imagePlugin,
    linkPlugin,
    frontmatterPlugin,
    diffSourcePlugin,
    toolbarPlugin,
    UndoRedo,
    BoldItalicUnderlineToggles,
    CodeToggle,
    CreateLink,
    InsertCodeBlock,
    CodeMirrorEditor,
    InsertImage,
    InsertTable,
    linkDialogPlugin,
    type CodeBlockEditorDescriptor,
    type ImageUploadHandler
} from "@mdxeditor/editor"
import { type FC } from 'react'
import { langs, theme } from "../../lib/editorConfig"
import { encode } from "base64-arraybuffer"
import imageCompression from "browser-image-compression"

type EditorProps = {
    markdown: string
    editorRef?: React.MutableRefObject<MDXEditorMethods | null>
    readOnly?: boolean
}

const FallbackCodeEditorDescriptor: CodeBlockEditorDescriptor = {
    // always use the editor, no matter the language or the meta of the code block
    match: () => true,
    // You can have multiple editors with different priorities, so that there's a "catch-all" editor (with the lowest priority)
    priority: 0,
    // The Editor is a React component
    Editor: CodeMirrorEditor
}

const imageHandler: ImageUploadHandler = async (image) => {
    const compressOptions = {
        maxSizeMB: 0.3,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
    } as const
    return new Promise<string>(async (resolve) => {
        const compressedImage = await imageCompression(image, compressOptions)
        const imageBuffer = await compressedImage.arrayBuffer()
        const b64 = encode(imageBuffer)
        const output = "data:image/png;base64, " + b64
        resolve(output);
    })
}

/**
 * Extend this Component further with the necessary plugins or props you need.
 * proxying the ref is necessary. Next.js dynamically imported components don't support refs. 
*/
const EditorComponent: FC<EditorProps & { setState?: (s: string) => void, enableSaveBtn?: (b: boolean) => void }> = (props) => {
    return (
        <MDXEditor
            ref={props.editorRef}
            markdown={props.markdown}
            onChange={(s) => {
                if (props.setState)
                    props.setState(s)
                if (props.enableSaveBtn)
                    props.enableSaveBtn(true)
            }}
            suppressHtmlProcessing={false}
            placeholder="Type markdown here..."
            readOnly={props.readOnly}
            className="pb-32"
            contentEditableClassName="prose prose-base md:prose-lg prose-pre:bg-transparent prose-code:bg-transparent prose-pre:p-0 max-w-none w-full prose-img:mx-auto prose-img:rounded-md prose-img:border prose-img:border-gray-200 prose-pre:no-scrollbar prose-code:no-scrollbar"
            plugins={[
                headingsPlugin({ allowedHeadingLevels: [1, 2, 3, 4, 5, 6] }),
                listsPlugin(),
                quotePlugin(),
                thematicBreakPlugin(),
                linkPlugin(),
                linkDialogPlugin(),
                codeBlockPlugin({ defaultCodeBlockLanguage: 'js', codeBlockEditorDescriptors: [FallbackCodeEditorDescriptor] }),
                codeMirrorPlugin({
                    codeBlockLanguages: langs,
                    theme: theme
                }),
                tablePlugin(),
                imagePlugin({ imageUploadHandler: imageHandler }),
                frontmatterPlugin(),
                diffSourcePlugin(),
                markdownShortcutPlugin(),
                toolbarPlugin({
                    toolbarContents: () => (
                        <div className="flex-wrap fixed bottom-2 left-1/2 -translate-x-1/2 flex justify-center p-1 h-fit bg-gray-100 border border-gray-200 drop-shadow-sm rounded-md">
                            <UndoRedo />
                            <BoldItalicUnderlineToggles />
                            <CreateLink />
                            <CodeToggle />
                            <InsertCodeBlock />
                            <InsertImage />
                            <InsertTable />
                        </div>
                    )
                })
            ]}
        />
    )
}

export default EditorComponent