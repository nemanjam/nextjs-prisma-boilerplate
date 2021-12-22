import React, { FC, useCallback, useEffect, useState } from 'react';
import { DropzoneOptions, useDropzone } from 'react-dropzone';
import { useFormContext } from 'react-hook-form';
import { withBem } from 'utils/bem';

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
  const b = withBem('dropzone-avatar');
  const [hover, setHover] = useState(false);

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
      <label htmlFor={name} className={b('label')}>
        {label}
      </label>
      <div {...getRootProps()}>
        <input {...rest} id={name} name={name} {...getInputProps()} />

        <div
          className={b('preview', { active: isDragActive })}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
        >
          {file && (
            <>
              <img
                src={URL.createObjectURL(file)}
                alt={file.name}
                className={b('image')}
              />
              <div className={b('overlay', { active: isDragActive || hover })}>
                <span>
                  {isDragActive && 'Drop here'}
                  {hover && 'Click or \n drag&drop'}
                </span>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default DropzoneAvatar;
