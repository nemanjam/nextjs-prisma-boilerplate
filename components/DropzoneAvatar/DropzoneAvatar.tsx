import React, { FC, useCallback, useEffect } from 'react';
import { DropzoneOptions, useDropzone } from 'react-dropzone';
import { useFormContext } from 'react-hook-form';

interface IFileInputProps
  extends React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  > {
  label?: string;
  dropzoneOptions?: DropzoneOptions;
}

const DropzoneAvatar: FC<IFileInputProps> = ({
  dropzoneOptions,
  name,
  label = name,
  ...rest
}) => {
  const { register, unregister, setValue, watch } = useFormContext();
  const file: File = watch(name);

  const onDrop = useCallback<DropzoneOptions['onDrop']>(
    (droppedFiles) => {
      setValue(name, droppedFiles?.[0], { shouldValidate: true, shouldDirty: true });
    },
    [setValue, name]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    ...dropzoneOptions,
    onDrop,
  });

  useEffect(() => {
    register(name);
    return () => {
      unregister(name);
    };
  }, [register, unregister, name]);

  return (
    <>
      <label htmlFor={name}>{label}</label>
      <div {...getRootProps()}>
        <input {...rest} id={name} name={name} {...getInputProps()} />

        <div className={isDragActive ? 'bg-gray-400' : 'bg-gray-200'}>
          {file && (
            <img
              src={URL.createObjectURL(file)}
              alt={file.name}
              style={{ width: '100px', height: '100px', objectFit: 'cover' }}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default DropzoneAvatar;
