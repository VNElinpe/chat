package org.vnelinpe.chat.dto;

import lombok.Data;

/**
 * 返回参数模型
 *
 * @author VNElinpe
 * @since 2023/3/2
 **/
@Data
public class ResponseDTO<T> {
    private String code;
    private String msg;
    private T data;

    /**
     * 成功响应参数
     * @param data 数据本身
     * @return 响应
     * @param <T> 类型
     */
    public static <T> ResponseDTO success(T data) {
        ResponseDTO<T> responseDTO = new ResponseDTO<>();
        responseDTO.setCode("0");
        responseDTO.setMsg("success");
        responseDTO.setData(data);
        return responseDTO;
    }
}
